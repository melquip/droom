(function ( $ ) {
    $.fn.viewWindow = function(options) {
        var settings = $.extend({
            // These are the defaults.
            //color: "#556b2f",
            //backgroundColor: "white"
        }, options );

        var itens=[];
        var winHeight=$(window).height();
        var winMaxScroll=$('body').outerHeight()-winHeight;

        this.each(function () {
            positionEL=$(this).offset();
            heightEL=$(this).outerHeight();

            btn=positionEL.top + heightEL;
            itens.push({
                height: heightEL,

                top: positionEL.top,
                bottom: Math.max( positionEL.top, positionEL.top + heightEL - winHeight),

                from: Math.max(0, positionEL.top-winHeight),
                to: Math.min(winMaxScroll,(btn))
            });
        });

        if (itens.length===1){
            return itens[0];
        }
        return itens;

    };

    $.fn.isVisible = function() {

        $scrollTop=$(window).scrollTop;

        this.each(function () {
            this.viewWindow();
        });
        return true;

    };


    var ScrollAsyncMove=false;
    var ScrollAsyncIsExec=false;
    $(window).on('scroll', function () {
        ScrollAsyncMove=true;
        if (ScrollAsyncIsExec===false){
            ScrollAsyncIsExec=true;
            setTimeout(execScrollAsync, 1);
        }
    });

    function execScrollAsync(){
        ScrollAsyncMove=false;
        ScrollAsyncIsExec=true;
        $(window).trigger('scrollAsync');
        if (ScrollAsyncMove){
            setTimeout(execScrollAsync, 1);
            //execScrollAsync();
        }else {
            ScrollAsyncIsExec=false;
        }
    }


    $(window).on('scrollAsync', function () {
        //console.log('ok');
    });



    var arrFunc={
        change_css:function(obj, value){

            if (obj.size!=''){

                calc='0';
                if (obj.size==='width'){
                    calc = obj.obj.outerWidth()+ 'px';
                }else if (obj.size==='height'){
                    calc = obj.obj.outerHeight() + 'px';
                }
                valueCSS=' calc( '+ value + obj.unit + ' '+obj.operator+ ' '+ calc + ' ) ';
            }else{
                valueCSS=value + obj.unit;
            }
            obj.obj.css(obj.property, obj.cssBefore +  valueCSS  + obj.cssAfter);


        },
        change_translate3d:function(obj, value){
            if (obj.size!=''){
                calc='0';
                if (obj.size==='width'){
                    calc = obj.obj.outerWidth()+ 'px';
                }else if (obj.size==='height'){
                    calc = obj.obj.outerHeight() + 'px';
                }
                valueCSS=' calc( '+ value + obj.unit + ' '+obj.operator+ ' '+ calc + ' ) ';
            }else{
              valueCSS=value + obj.unit;
            }
            $actual=obj.obj.css('transform');
            if(obj.property=='x'){
               valueCSS='translate3d(' + valueCSS + ', 0px,0px)';
            } else if (obj.property=='y'){
                valueCSS='translate3d(0px,' + valueCSS + ', 0px)';
            } else if (obj.property=='z'){
                valueCSS='translate3d(0px, 0px,' + valueCSS + ')';
            }
            //console.log(obj.cssBefore +  valueCSS  + obj.cssAfter)
           obj.obj.css('MozTransform', obj.cssBefore +  valueCSS  + obj.cssAfter);
           obj.obj.css('transform', obj.cssBefore +  valueCSS  + obj.cssAfter);
        },
        change_class:function(obj, value){
           // console.log('ajksdhajhsdj');
            //element.css(obj.property, value + obj.unit);
        }
    };
    $.fn.liveParallax = function(options) {
        //var settings = $.extend([], options );
        var settings = options;

        this.each(function () {
            //cada pai..
            var $el=$(this);

            var data=$el.data('liveparallax');
            if (typeof data ==='string') {
                data=JSON.parse(data);
            }
            if (typeof data ==='undefined'){
                data=settings;
            }

           // var $elsettings = $.extend(settings, data);
            //console.log(data);

            var tempData=[];
            var calcsH=[];
            $.grep(data, function( value) {
                value = $.extend({
                    obj:null,
                    element:"",
                    posStart:0,
                    posFinish:100,
                    change:'css',//Opções: css, callback
                    property:"top",
                    viewPercentage:0,//number 0 a 100
                    viewAfter: 0,
                    val:'numeric',//numeric, text, class
                    vStart:0,
                    vFinish:100,
                    unit:"%",
                    textIn:'',
                    textOut:'',
                    cssBefore:'',//cssBefore + value + unit + cssAfter
                    cssAfter:'',
                    setValue:'always', //always//no caso de numeric define os valores //todo:
                    callback:null,//change:callback
                    size:'',//width ou height para ser tirado ao valor definido
                    operator:'+',//width ou height para ser tirado ao valor definido
					steps: 1,//interno
                    last:''
                }, value);
                //console.log(value);
                if (value.element!=''){
                    value.obj=$(value.element, $el);
                    if ( value.obj.length===0){
                        return false;
                    }
                }else{
                    value.obj=$el;
                }
				if(typeof value.vStart == 'string' && value.vStart.indexOf('return') > -1) {
                    try {
                        var exec_vStart = new Function('value', value.vStart);
                        value.vStart = parseFloat(exec_vStart(value));
                    } catch (e) {
                        return e;
                    }
                }
                if(typeof value.vFinish == 'string' && value.vFinish.indexOf('return') > -1) {
                    try {
                        var exec_vFinish = new Function('value', value.vFinish);
                        value.vFinish = parseFloat(exec_vFinish(value));
                    } catch (e) {
                        return e;
                    }
                }
                
				value.steps= value.vFinish - value.vStart;

                calcsH.push(value.viewPercentage);
                tempData.push(value);
                return true;
            });
            data=tempData;

            var func=function () {

                var posScroll=$(window).scrollTop();
                var position=$el.viewWindow();
                var positionView=[];



                $.each(data, function( index, value ) {
                    key=this.viewPercentage+'-'+this.viewAfter;
                    if (positionView[key]===undefined){
                        if (this.viewPercentage===0 && this.viewAfter===0){
                            v=((posScroll-position.from)*100)/(position.to-position.from);
                        }else{
                            Xstart=(position.top-position.from)*((100-this.viewPercentage)/100);
                            Xfinish=(position.top-position.from)*((100-Math.min(100, this.viewPercentage-this.viewAfter))/100);
                            start=(position.top-Xstart);
                            steps=((position.bottom+Xfinish)-(start));
                            if (posScroll<start){
                                v=0;
                            }else if(posScroll>start + steps){
                                v=100;
                            }else{
                                v=(((posScroll-(start))*100)/steps);
                            }

                        }

                        positionView[key] = Math.min(100, Math.max(0, v));
                    }



                    var valT=this.vStart;


                    var positionViewT=((positionView[key]-this.posStart)*100)/(this.posFinish-this.posStart);
                    positionViewT=Math.min(100, Math.max(0, positionViewT));


                    if (100===positionViewT){
                        valT=this.vFinish;
                    }else if (0===positionViewT){
                        valT=this.vStart;
                    }else{
                        valT= this.vStart + ((positionViewT)*this.steps/(100));
                    }

                    if (typeof this.callback === 'function'){
                        this.callback(this,  valT);
                    }else{
                        arrFunc['change_'+this.change](this, valT);
                    }
                });
            };

            $(window).on('scrollAsync', func);
            func();

        });


        return true;




    };
    $(document).ready(function (){
        $('*[data-liveparallax]').liveParallax();
    });
	
}( jQuery ));