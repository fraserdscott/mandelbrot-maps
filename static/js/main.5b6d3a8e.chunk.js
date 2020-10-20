(this["webpackJsonpmandelbrot-maps"]=this["webpackJsonpmandelbrot-maps"]||[]).push([[0],{210:function(e){e.exports=JSON.parse('{"a":"https://forms.gle/BeiSq3CxhEFwZkQ86"}')},229:function(e,t,n){e.exports=n(242)},234:function(e,t,n){},235:function(e,t,n){},242:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(11),i=n.n(r),c=(n(234),n(7)),l=n(293),s=n(270),u=n(16),m=n(24),d=(n(235),[-.7746931,.1242266]),f={xy:[0,0],z:1,theta:0},g={default:{xy:{mass:1,tension:500,friction:75},zoom:{mass:1,tension:300,friction:40},rot:{mass:1,tension:400,friction:75}},user:{xy:{mass:1,tension:2e3,friction:100},zoom:{mass:1,tension:700,friction:60},rot:{mass:1,tension:400,friction:75}}},b=n(218),h=n(267),p=n(271),v=n(274),w=n(107),x=n.n(w),y=n(45);function E(e){var t=e.domTarget,n=e.controls,a=e.screenScaleMultiplier,o=e.setDragging,r=Object(c.a)(n.xyCtrl,2),i=r[0].xy,l=r[1],s=Object(c.a)(n.zoomCtrl,2),u=s[0],d=u.z,f=u.minZoom,b=u.maxZoom,h=s[1],p=Object(c.a)(n.rotCtrl,1)[0].theta;return{handlers:{onDragStart:function(e){var t=e.event;return null===t||void 0===t?void 0:t.preventDefault()},onPinchStart:function(e){var t=e.event;return null===t||void 0===t?void 0:t.preventDefault()},onPinch:function(e){Object(c.a)(e.vdva,1)[0];var t=e.down,n=Object(c.a)(e.delta,1)[0],a=e.origin,o=e.first,r=e.memo,l=void 0===r?[i.getValue()]:r;if(o)return[Object(c.a)(l,1)[0],a];var s=d.getValue()*(1+.03*n),u=x.a.clamp(s,f.getValue(),b.getValue());return h({z:u,config:t?g.user.zoom:g.default.zoom}),l},onWheel:function(e){var t=Object(c.a)(e.movement,2)[1],n=e.active,a=d.getValue(),o=a*(1-t*(t<0?.0015:8e-4));return h({z:x.a.clamp(o,f.getValue(),b.getValue()),config:n?g.user.zoom:g.default.zoom}),a},onDrag:function(e){var n,r=e.down,s=e.movement,u=Object(c.a)(e.direction,2),f=(u[0],u[1],e.velocity,e.pinching),b=(e.last,e.cancel),h=e.memo,v=void 0===h?{xy:i.getValue(),theta:p.getValue()}:h;f&&b&&b();var w=((null===(n=t.current)||void 0===n?void 0:n.height)||100)*d.getValue()*a,x=Object(m.vScale)(-2/w,s),E=Object(c.a)(x,2),O=[E[0],-E[1]],j=p.getValue();return l({xy:Object(y.a)(v.xy,Object(m.vRotate)(j,O)),config:r?g.user.xy:g.default.xy}),o(r),v}},config:{eventOptions:{passive:!1,capture:!1},domTarget:t}}}function O(e,t){var n=t.xy,a=t.z,o=t.theta,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];void 0!==n&&e.xyCtrl[1]({xy:Object(m.vScale)(1/1e-7,n),config:g.default.xy,immediate:r}),void 0!==a&&e.zoomCtrl[1]({z:a,config:g.default.zoom,immediate:r}),void 0!==o&&e.rotCtrl[1]({theta:o,config:g.default.rot,immediate:r})}var j=function(e){var t=Object(a.useState)(d[0]),n=Object(c.a)(t,2),r=n[0],i=n[1],l=Object(a.useState)(d[1]),u=Object(c.a)(l,2),m=u[0],f=u[1],g=Object(a.useState)(85),w=Object(c.a)(g,2),x=w[0],y=w[1],E=Object(a.useState)(.6),j=Object(c.a)(E,2),z=j[0],C=j[1];return o.a.createElement(b.a,{in:e.show},o.a.createElement(h.a,{style:{width:"auto",zIndex:1300,position:"relative",padding:8,display:"flex",flexDirection:"column",flexShrink:1}},o.a.createElement(s.a,{container:!0,direction:"column",alignItems:"center"},o.a.createElement(p.a,{size:"small",style:{width:"12ch"},onChange:function(e){return i(Number(e.target.value))},type:"number",defaultValue:r,inputProps:{step:.01},label:"x"}),o.a.createElement(p.a,{size:"small",style:{width:"12ch"},onChange:function(e){return f(Number(e.target.value))},type:"number",defaultValue:m,inputProps:{step:.01},label:"y"}),o.a.createElement(s.a,{container:!0,direction:"row",justify:"space-around"},o.a.createElement(p.a,{size:"small",style:{width:"5ch"},onChange:function(e){return y(Number(e.target.value))},type:"number",defaultValue:x,inputProps:{min:0},label:"zoom"}),o.a.createElement(p.a,{size:"small",style:{width:"5ch"},onChange:function(e){return C(Number(e.target.value))},type:"number",defaultValue:z,inputProps:{step:.1},label:"theta"})),o.a.createElement(v.a,{style:{marginTop:12},onClick:function(){return O(e.mandelbrot,{xy:[r,m],z:x,theta:z})}},"Go"))))},z=n(109),C=function(e){return o.a.createElement(b.a,{in:e.show},o.a.createElement(h.a,{style:{width:"auto",zIndex:1300,position:"relative",padding:"6px 12px",marginBottom:8}},o.a.createElement(z.a,{align:"right",style:{fontFamily:"monospace",fontSize:"1.2rem"}},o.a.createElement(u.a.span,null,e.mandelbrot.xy.interpolate((function(e,t){return"".concat((1e-7*e).toFixed(7)," : x")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.xy.interpolate((function(e,t){return"".concat((1e-7*t).toFixed(7)," : y")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.zoom.interpolate((function(e){return"".concat(e.toFixed(2)," : z")}))),o.a.createElement("br",null),o.a.createElement(u.a.span,null,e.mandelbrot.theta.interpolate((function(e){return"".concat(e.toFixed(3)," : t")}))))))},S=n(275),A=function(e){var t=o.a.useState(0),n=Object(c.a)(t,2),a=n[0],r=n[1],i=o.a.useState([0,0]),l=Object(c.a)(i,2),u=l[0],m=l[1],d=o.a.useState(!1),f=Object(c.a)(d,2),g=f[0],p=f[1],w=o.a.useState(!1),x=Object(c.a)(w,2),y=x[0],E=x[1],j=o.a.useState(!1),z=Object(c.a)(j,2),C=z[0],A=z[1],k=o.a.useState(!1),W=Object(c.a)(k,2),_=W[0],M=W[1],P=o.a.useState("not set"),I=Object(c.a)(P,2),R=I[0],N=I[1],T=o.a.useState("not set"),D=Object(c.a)(T,2),F=D[0],B=D[1],V=o.a.useState("not set"),L=Object(c.a)(V,2),X=L[0],U=L[1],q=function(e,t){"clickaway"!==t&&(p(!1),E(!1),A(!1),M(!1))};return o.a.createElement(b.a,{in:e.show},o.a.createElement(h.a,{style:{width:"auto",zIndex:1300,position:"relative",padding:8,display:"flex",flexDirection:"column",flexShrink:1}},o.a.createElement(s.a,{container:!0,direction:"column",alignItems:"center"},o.a.createElement("div",{style:{marginTop:12,fontWeight:"bold"}},"Misiurewicz points"),o.a.createElement("div",{style:{marginTop:12}},"Click a button multiple times"),o.a.createElement("div",{style:{marginTop:12}},"to see the animation!"),Ye.map((function(t){return o.a.createElement(v.a,{fullWidth:!0,style:{marginTop:12},onClick:function(){return n=t[0],o=t[1],i=t[2],void(n[0]!==u[0]&&n[1]!==u[1]?(r(0),m(n),N("Translating to ".concat(n)),B("Magnifying ".concat(o,"x")),U("Rotating by ".concat(i," radians"))):0===a?(p(!0),O(e.mandelbrot,{xy:[-.45,0],z:.8,theta:0}),O(e.julia,{xy:[-.45,0],z:.8,theta:0}),r(1)):1===a?(E(!0),O(e.mandelbrot,{xy:n,z:1,theta:0}),O(e.julia,{xy:n,z:1,theta:0}),r(2)):2===a?(A(!0),O(e.mandelbrot,{xy:n,z:o,theta:0}),O(e.julia,{xy:n,z:o,theta:0}),r(3)):3===a&&(M(!0),O(e.mandelbrot,{xy:n,z:o,theta:i}),O(e.julia,{xy:n,z:o,theta:0}),r(4)));var n,o,i}},t[0].toString())})),o.a.createElement(S.a,{anchorOrigin:{vertical:"top",horizontal:"center"},open:g,onClose:q,autoHideDuration:3e3,message:"Resetting"}),o.a.createElement(S.a,{anchorOrigin:{vertical:"top",horizontal:"center"},open:y,onClose:q,autoHideDuration:3e3,message:R}),o.a.createElement(S.a,{anchorOrigin:{vertical:"top",horizontal:"center"},open:C,onClose:q,autoHideDuration:3e3,message:F}),o.a.createElement(S.a,{anchorOrigin:{vertical:"top",horizontal:"center"},open:_,onClose:q,autoHideDuration:3e3,message:X}))))},k=n(87),W=n(296),_=n(4),M=n(280),P=n(276),I=n(278),R=n(279),N=n(277),T=n(211),D=n.n(T),F=n(281),B=n(282),V=n(294),L=n(283),X=n(88),U=n(284),q=n(285),G=n(286),J=n(287),Z=n(288),H=n(213),Q=n.n(H),K=n(212),Y=n.n(K),$=n(295),ee=n(210);var te=Object(_.a)((function(e){return Object(W.a)({root:{margin:0,padding:e.spacing(2),display:"flex",flexDirection:"row"},image:{marginTop:"auto",marginBottom:"auto",marginRight:8,height:50},closeButton:{marginLeft:"auto",color:e.palette.grey[500]}})}))((function(e){var t=e.children,n=e.classes,a=e.onClose,r=Object(k.a)(e,["children","classes","onClose"]);return o.a.createElement(P.a,Object.assign({disableTypography:!0,className:n.root},r),o.a.createElement("img",{src:"logo-512.png",alt:"Mandelbrot Maps logo",className:n.image}),o.a.createElement(z.a,{variant:"h1",style:{fontSize:24,marginTop:"auto",marginBottom:"auto"}},t),a?o.a.createElement(N.a,{"aria-label":"close",className:n.closeButton,onClick:a},o.a.createElement(D.a,null)):null)})),ne=Object(_.a)((function(e){return{root:{padding:e.spacing(3)}}}))(I.a),ae=Object(_.a)((function(e){return{root:{margin:0,padding:e.spacing(1)}}}))(R.a);function oe(e){return o.a.createElement($.a,Object.assign({elevation:6,variant:"filled"},e))}function re(e){var t=Object(c.a)(e.ctrl,2),n=t[0],r=t[1],i=Object(a.useState)(!1),l=Object(c.a)(i,2),s=l[0],u=l[1],m=function(){return r(!1)},d=function(e){var t="";e.screen.width&&(t+=(e.screen.width?e.screen.width:"")+" x "+(e.screen.height?e.screen.height:""));var n,a,o,r=navigator.appVersion,i=navigator.userAgent,c=navigator.appName,l=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10);-1!=(a=i.indexOf("Opera"))&&(c="Opera",l=i.substring(a+6),-1!=(a=i.indexOf("Version"))&&(l=i.substring(a+8))),-1!=(a=i.indexOf("OPR"))?(c="Opera",l=i.substring(a+4)):-1!=(a=i.indexOf("Edge"))?(c="Microsoft Edge",l=i.substring(a+5)):-1!=(a=i.indexOf("MSIE"))?(c="Microsoft Internet Explorer",l=i.substring(a+5)):-1!=(a=i.indexOf("Chrome"))?(c="Chrome",l=i.substring(a+7)):-1!=(a=i.indexOf("Safari"))?(c="Safari",l=i.substring(a+7),-1!=(a=i.indexOf("Version"))&&(l=i.substring(a+8))):-1!=(a=i.indexOf("Firefox"))?(c="Firefox",l=i.substring(a+8)):-1!=i.indexOf("Trident/")?(c="Microsoft Internet Explorer",l=i.substring(i.indexOf("rv:")+3)):(n=i.lastIndexOf(" ")+1)<(a=i.lastIndexOf("/"))&&(c=i.substring(n,a),l=i.substring(a+1),c.toLowerCase()==c.toUpperCase()&&(c=navigator.appName)),-1!=(o=l.indexOf(";"))&&(l=l.substring(0,o)),-1!=(o=l.indexOf(" "))&&(l=l.substring(0,o)),-1!=(o=l.indexOf(")"))&&(l=l.substring(0,o)),s=parseInt(""+l,10),isNaN(s)&&(l=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10));var u=/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(r),m=!!navigator.cookieEnabled;"undefined"!=typeof navigator.cookieEnabled||m||(document.cookie="testcookie",m=-1!=document.cookie.indexOf("testcookie"));var d="-",f=[{s:"Windows 10",r:/(Windows 10.0|Windows NT 10.0)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 3.11",r:/Win16/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Chrome OS",r:/CrOS/},{s:"Linux",r:/(Linux|X11(?!.*CrOS))/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}];for(var g in f){var b=f[g];if(b.r.test(i)){d=b.s;break}}var h="-";switch(/Windows/.test(d)&&(h=/Windows (.*)/.exec(d)[1],d="Windows"),d){case"Mac OS X":h=/Mac OS X (10[\.\_\d]+)/.exec(i)[1];break;case"Android":h=/Android ([\.\_\d]+)/.exec(i)[1];break;case"iOS":h=(h=/OS (\d+)_(\d+)_?(\d+)?/.exec(r))[1]+"."+h[2]+"."+(0|h[3])}var p,v,w,x,y=i.substring(i.indexOf("(")+1,i.indexOf(")")),E=y.substring(y.lastIndexOf(";")+1),O=document.createElement("canvas");try{v=(p=O.getContext("webgl")||O.getContext("experimental-webgl")).getExtension("WEBGL_debug_renderer_info"),w=p.getParameter(v.UNMASKED_VENDOR_WEBGL),x=p.getParameter(v.UNMASKED_RENDERER_WEBGL)}catch(j){}return{browser:c,browserVersion:s,browserRelease:l,device:E,os:d,osVersion:h,mobile:u,platform:navigator.platform,screen:t,dpr:+e.devicePixelRatio.toFixed(3),gpu:x,gpuVendor:w,userAgent:navigator.userAgent}}(window);return o.a.createElement(M.a,{onClose:m,"aria-labelledby":"customized-dialog-title",open:n,maxWidth:"md"},o.a.createElement(te,{id:"customized-dialog-title",onClose:m},"Mandelbrot Maps"),o.a.createElement(ne,{dividers:!0,style:{maxWidth:700}},o.a.createElement(z.a,{gutterBottom:!0},"Mandelbrot Maps is an interactive fractal explorer built using React and WebGL."),o.a.createElement(z.a,{gutterBottom:!0},"Developed by"," ",o.a.createElement(F.a,{href:"https://jmaio.github.io/",target:"_blank"},"Joao Maio")," ","in 2019/2020 as part of an Honours Project at The University of Edinburgh, under the supervision of Philip Wadler."),o.a.createElement(z.a,{gutterBottom:!0},"The project was simultaneously undertaken by Freddie Bawden, also under the supervision of Philip Wadler. Freddie's version of the project is available at:"," ",o.a.createElement(F.a,{href:"http://mmaps.freddiejbawden.com/",target:"_blank"},"mmaps.freddiejbawden.com")),o.a.createElement(z.a,{gutterBottom:!0},"The"," ",o.a.createElement(F.a,{href:"https://homepages.inf.ed.ac.uk/wadler/mandelbrot-maps/index.html",target:"_blank"},"original Mandelbrot Maps project")," ","was developed by Iain Parris in 2008 as a Java Applet."),o.a.createElement(z.a,{gutterBottom:!0},"Mandelbrot set shader code adapted from"," ",o.a.createElement(F.a,{href:"https://www.shadertoy.com/view/4df3Rn"},"Mandelbrot - smooth")," by"," ",o.a.createElement(F.a,{href:"http://iquilezles.org/",target:"_blank"},"Inigo Quilez"),"."),o.a.createElement(B.a,{style:{marginTop:30,marginBottom:30}}),o.a.createElement(V.a,{style:{display:"flex"}},o.a.createElement(L.a,{component:X.a,style:{width:"auto",margin:"auto",maxWidth:460}},o.a.createElement(U.a,{size:"small","aria-label":"a dense table"},o.a.createElement(q.a,null,o.a.createElement(G.a,null,o.a.createElement(J.a,{align:"center",colSpan:2,variant:"head"},"Device properties"))),o.a.createElement(Z.a,null,Object.entries(d).map((function(e){var t=Object(c.a)(e,2),n=t[0],a=t[1];return o.a.createElement(G.a,{key:n},o.a.createElement(J.a,null,n),o.a.createElement(J.a,{align:"right",style:{fontFamily:"monospace"}},String(a)))})))))),o.a.createElement(B.a,{style:{marginTop:30,marginBottom:30}}),o.a.createElement(V.a,{style:{display:"flex"}},o.a.createElement(z.a,{variant:"overline",align:"center",style:{margin:"auto"}},"Build:",o.a.createElement(z.a,{style:{fontFamily:"monospace"}},"2020-10-20T20:53:57.525Z")))),o.a.createElement(ae,null,o.a.createElement(v.a,{onClick:function(){!function(e){console.log(s);try{navigator.clipboard.writeText(e),u(!0)}catch(t){window.prompt("Auto copy to clipboard failed, copy manually from below:",e)}}(JSON.stringify(d))},color:"primary",variant:"outlined",startIcon:o.a.createElement(Y.a,null)},"Copy"),o.a.createElement(S.a,{open:s,autoHideDuration:5e3},o.a.createElement(oe,{onClose:function(){return u(!1)},severity:"info"},"Device properties copied!")),o.a.createElement(F.a,{href:ee.a,target:"_blank",rel:"noopener",style:{textDecoration:"none"}},o.a.createElement(v.a,{autoFocus:!0,color:"primary",variant:"outlined",startIcon:o.a.createElement(Q.a,null)},"Feedback"))))}var ie=function(e){var t=e.maxI,n=void 0===t?300:t,a=e.AA,o=void 0===a?1:a,r=e.B,i=void 0===r?64:r;return"\n\n#define AA ".concat(o,"\n#define MAXI ").concat(n,"\n#define B ").concat(i.toFixed(1),'\n\n// set high float precision (lower than this may break colours on mobile)\nprecision highp float;\n\n// need to know the resolution of the canvas\nuniform vec2 resolution;\n\n// properties should be passed as uniforms\nuniform int   u_maxI;\nuniform vec2  u_xy;\nuniform vec2  u_c;\nuniform float u_zoom;\nuniform float u_theta;\n\nfloat julia( vec2 z, vec2 c ) {\n\n  float l = 0.0;\n  for( int i=0; i<MAXI; i++ )\n  {\n      z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;\n      if( dot(z,z)>(B*B) ) break;\n      l += 1.0;\n  }\n\n  // maxed out iterations\n  if( l>float(MAXI)-1.0 ) return 0.0;\n\n  // equivalent optimized smooth interation count\n  l = l - log2(log2(dot(z,z))) + 4.0;\n\n  return l;\n}\n\nvoid main() {    \n  // set the initial colour to black\n  vec3 col = vec3(0.0);\n\n  // anti-aliasing\n  #if AA>1\n  for( int m=0; m<AA; m++ )\n  for( int n=0; n<AA; n++ )\n  {\n      vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;\n      float w = float(AA*m+n);\n  #else    \n      // adjust pixels to range from [-1, 1]\n      vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;\n  #endif\n  \n  // constant "c" to add, based on mandelbrot position\n  vec2 c = u_c;\n  vec2 z = u_xy + p/u_zoom;\n\n  float l = julia(z, c);\n  col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));\n\n  // antialiasing\n  #if AA>1\n  }\n  col /= float(AA*AA);\n  #endif\n\n  // Output to screen\n  gl_FragColor = vec4( col, 1.0 );\n}\n')},ce=n(297),le=n(298),se=function(e){return{showMinimap:{k:"showMinimap",label:"Minimap",checked:e.showMinimap,control:o.a.createElement(ce.a,null)},showCrosshair:{k:"showCrosshair",label:"Crosshair",checked:e.showCrosshair,control:o.a.createElement(ce.a,null)},showCoordinates:{k:"showCoordinates",label:"Show coordinates",checked:e.showCoordinates,control:o.a.createElement(ce.a,null)},showMisiurewiczPoints:{k:"showMisiurewiczPoints",label:"Show Misiurewicz Points",checked:e.showMisiurewiczPoints,control:o.a.createElement(ce.a,null)},maxI:{k:"maxI",label:"Iterations",value:e.maxI,labelPlacement:"top",style:{marginLeft:0,marginRight:0},control:o.a.createElement(le.a,{min:10,max:1e3,step:10,valueLabelDisplay:"auto",marks:[{value:10,label:10},{value:250,label:250},{value:500,label:500},{value:750,label:750},{value:1e3,label:1e3}]})},useDPR:{k:"useDPR",label:"Use pixel ratio (".concat(+window.devicePixelRatio.toFixed(3),")"),checked:e.useDPR,control:o.a.createElement(ce.a,null)},useAA:{k:"useAA",label:"Anti-aliasing (slow)",checked:e.useAA,control:o.a.createElement(ce.a,null)},showFPS:{k:"showFPS",label:"Show FPS",checked:e.showFPS,control:o.a.createElement(ce.a,null)}}},ue={showMinimap:!0,showCrosshair:!0,showCoordinates:!0,showMisiurewiczPoints:!0,maxI:250,showFPS:!1,useDPR:!1,useAA:!1},me=Object(a.createContext)({settings:ue,setSettings:function(){},settingsWidgets:se(ue)}),de=function(e){var t=e.children,n=Object(a.useState)(ue),r=Object(c.a)(n,2),i=r[0],l=r[1];return o.a.createElement(me.Provider,{value:{settings:i,setSettings:l,settingsWidgets:se(i)}},t)},fe=n(110),ge=n(217),be=n(17),he=Object(ge.a)({props:{MuiSwitch:{color:"primary"},MuiButton:{variant:"outlined"}},palette:{primary:{main:be.a.blue[700]},secondary:{main:be.a.red[700]},info:{main:be.a.blue[700]}}}),pe=he,ve=n(65),we=n(40),xe={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}},ye=o.a.forwardRef((function(e,t){var n=t,r=Object(a.useRef)(),i=Object(a.useRef)(),c=Object(a.useRef)(),l=Object(a.useRef)(),s=e.u,d=e.fps,f=Object(a.useCallback)((function(){return e.mini?1:e.u.zoom.getValue()}),[e.mini,e.u.zoom]),g=Object(a.useRef)(f()),b=e.useDPR?window.devicePixelRatio:1;Object(a.useEffect)((function(){r.current=n.current.getContext("webgl")}),[n]),Object(a.useEffect)((function(){c.current=we.a(r.current,xe)}),[r]),Object(a.useEffect)((function(){g.current=e.u.zoom.getValue()}),[e.u]),Object(a.useEffect)((function(){l.current=we.b(r.current,["\nattribute vec4 position;\n\nvoid main() {\n  gl_Position = position;\n}\n",e.fragShader])}),[r,e.fragShader]);var h=Object(a.useRef)(0),p=Object(a.useRef)(0),v=Object(a.useRef)(0),w=Object(a.useCallback)((function(e){var t;we.d(n.current,b),r.current.viewport(0,0,n.current.width,n.current.height);var a={resolution:[n.current.width,n.current.height],u_zoom:f(),u_c:void 0===s.c?0:Object(m.vScale)(1e-7,s.c.getValue()),u_xy:Object(m.vScale)(1e-7,s.xy.getValue()),u_maxI:s.maxI,u_theta:null===(t=s.theta)||void 0===t?void 0:t.getValue(),myValues:$e};r.current.useProgram(l.current.program),we.e(r.current,l.current,c.current),we.f(l.current,a),we.c(r.current,c.current),void 0!==d&&(p.current++,v.current+=e-h.current,h.current=e,v.current>=1e3&&(d((p.current*(1e3/v.current)).toFixed(1)),p.current=0,v.current-=1e3)),i.current=requestAnimationFrame(w)}),[r,s,f,b,d,1e3,n]);return Object(a.useEffect)((function(){return i.current=requestAnimationFrame(w),function(){return cancelAnimationFrame(i.current)}}),[w]),o.a.createElement(u.a.canvas,{className:"renderer",ref:t,style:Object(ve.a)({cursor:e.dragging?"grabbing":"grab"},e.style)})}));ye.displayName="WebGLCanvas";var Ee=ye,Oe=function(e){var t=e.canvasRef,n=e.onClick,a=e.show,r=Object(k.a)(e,["canvasRef","onClick","show"]);return o.a.createElement(b.a,{in:a},o.a.createElement(fe.a,{style:{position:"absolute",zIndex:1300,margin:"0.5rem",left:0,bottom:0,height:100,width:100,borderRadius:8,boxShadow:"0px 2px 10px 1px rgba(0, 0, 0, 0.4)",overflow:"hidden"},onClick:n},o.a.createElement(Ee,Object.assign({mini:!0,ref:t},r,{style:{borderRadius:8,cursor:"pointer"}}))))};function je(e){var t=Object(a.useRef)(null),n=Object(a.useRef)(null),r=Object(c.a)(e.controls.xyCtrl,1)[0].xy,i=Object(c.a)(e.controls.zoomCtrl,2),l=i[0].z,s=i[1],u=e.maxI,m=e.useAA?2:1,d=ie({maxI:u,AA:m}),f=ie({maxI:u,AA:2}),g={zoom:l,xy:r,c:e.c,maxI:u},b=Object(a.useState)(!1),h=Object(c.a)(b,2),p=h[0],v=h[1],w=E({domTarget:t,controls:e.controls,screenScaleMultiplier:1e-7/(e.useDPR?window.devicePixelRatio:1),setDragging:v}),x=Object(y.b)(w.handlers,w.config);return Object(a.useEffect)((function(){x()}),[x]),o.a.createElement(me.Consumer,null,(function(a){var r=a.settings;return o.a.createElement("div",{className:"renderer",style:{position:"relative"}},o.a.createElement(Ee,{id:"julia",fragShader:d,useDPR:e.useDPR,u:g,ref:t,dragging:p}),o.a.createElement(Oe,{fragShader:f,useDPR:r.useDPR,u:g,canvasRef:n,onClick:function(){return s({z:1})},show:r.showMinimap}))}))}var ze=function(e,t){return{stroke:e,radius:t}},Ce=ze(2,100),Se=ze(1,30),Ae=function(e){var t=e.maxI,n=void 0===t?300:t,a=e.AA,o=void 0===a?1:a,r=e.B,i=void 0===r?64:r,c=e.showM,l=void 0!==c&&c,s=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],u=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{stroke:2,radius:100};return"\n// Adapted by Joao Maio/2019, based on work by inigo quilez - iq/2013\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// See here for more information on smooth iteration count:\n// http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm\n\n#define false 0\n#define true 1\n\n// render parameters\n#define AA ".concat(o,"\n#define MAXI ").concat(n,"\n#define B ").concat(i.toFixed(1),"\n#define showM ").concat(l,"\n\n// crosshair parameters\n#define show_crosshair ").concat(s,"\n#define cross_stroke ").concat(u.stroke.toFixed(1),"\n#define cross_radius ").concat(u.radius.toFixed(1),'\n\n// set high float precision (lower than this may break colours on mobile)\nprecision highp float;\n\n// need to know the resolution of the canvas\nuniform vec2 resolution;\n\n// properties should be passed as uniforms\nuniform int   u_maxI;  \nuniform vec2  u_xy;\nuniform float u_zoom;\nuniform float u_theta;\nuniform float myValues[8];\n\nbool crosshair( float x, float y ) {\n  float abs_x = abs(2.0*x - resolution.x);\n  float abs_y = abs(2.0*y - resolution.y);\n\n  return \n  // crosshair in centre of screen\n  (abs_x <= cross_stroke || abs_y <= cross_stroke) &&\n  // crosshair size / "radius"\n  (abs_x <= cross_radius && abs_y <= cross_radius);\n}\n\nfloat mandelbrot( in vec2 c ) {\n    if (showM == true) {\n      for( int i=0; i<8; i+=2 )\n      {\n        float d = pow(distance(c, vec2(myValues[i], myValues[i+1])), 2.0);\n        if (d < 0.01 && d > 0.007) return 100.0;\n      }\n    }\n\n    {\n        float c2 = dot(c, c);\n        // skip computation inside M1 - http://iquilezles.org/www/articles/mset_1bulb/mset1bulb.htm\n        if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;\n        // skip computation inside M2 - http://iquilezles.org/www/articles/mset_2bulb/mset2bulb.htm\n        if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;\n    }\n\n    float l = 0.0;\n    vec2 z  = vec2(0.0);\n    for( int i=0; i<MAXI; i++ )\n    {\n        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;\n        if( dot(z,z)>(B*B) ) break;\n        l += 1.0;\n    }\n\n    // maxed out iterations\n    if( l>float(MAXI)-1.0 ) return 0.0;\n    \n    // optimized smooth interation count\n    l = l - log2(log2(dot(z,z))) + 4.0;\n\n    return l;\n}\n\nvoid main() {    \n    // set the initial colour to black\n    vec3 col = vec3(0.0);\n\n    // anti-aliasing\n    #if AA>1\n    for( int m=0; m<AA; m++ )\n    for( int n=0; n<AA; n++ )\n    {\n        // vec2 p = (-iResolution.xy + 2.0*(fragCoord.xy+vec2(float(m),float(n))/float(AA)))/iResolution.y;\n        vec2 p = (2.0*(gl_FragCoord.xy + vec2(float(m), float(n)) / float(AA) ) - resolution.xy)/resolution.y;\n        float w = float(AA*m+n);\n    #else    \n        // adjust pixels to range from [-1, 1]\n        vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;\n    #endif\n\n    float sinT = sin(u_theta);\n    float cosT = cos(u_theta);\n\n    vec2 xy = vec2( p.x*cosT - p.y*sinT, p.x*sinT + p.y*cosT );\n    // c is based on offset and grid position, z_0 = 0\n    vec2 c = u_xy + xy/u_zoom;\n    \n    float l = mandelbrot(c);\n    col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));\n\n    // antialiasing\n    #if AA>1\n    }\n    col /= float(AA*AA);\n    #endif\n\n    #if show_crosshair\n    if (crosshair(gl_FragCoord.x, gl_FragCoord.y)) {\n        col = 1. - col;\n    }\n    #endif\n\n    // Output to screen\n    gl_FragColor = vec4( col, 1.0 );\n}\n    ')},ke=function(e){return o.a.createElement(b.a,{in:e.show},o.a.createElement(h.a,{style:{position:"fixed",top:0,left:0,padding:"4px 12px",margin:6,fontFamily:"monospace",borderRadius:100,fontSize:"1.8rem",zIndex:1300,userSelect:"none"}},o.a.createElement(u.a.div,null,e.fps)))};function We(e){var t=Object(a.useRef)(null),n=Object(a.useRef)(null),r=Object(c.a)(e.controls.xyCtrl,1)[0].xy,i=Object(c.a)(e.controls.zoomCtrl,2),l=i[0].z,s=i[1],u=Object(c.a)(e.controls.rotCtrl,1)[0].theta,m=e.maxI,d=e.useAA?2:1,f=Ae({maxI:m,AA:d,showM:e.showMisiurewiczPoints},e.showCrosshair,Ce),g=Ae({maxI:m,AA:2},e.showCrosshair,Se),b=Object(a.useState)(!1),h=Object(c.a)(b,2),p=h[0],v=h[1],w=E({domTarget:t,controls:e.controls,screenScaleMultiplier:1e-7/(e.useDPR?window.devicePixelRatio:1),setDragging:v}),x=Object(y.b)(w.handlers,w.config);Object(a.useEffect)((function(){x()}),[x]);var O=Object(a.useState)(""),j=Object(c.a)(O,2),z=j[0],C=j[1];return o.a.createElement(me.Consumer,null,(function(e){var a=e.settings;return o.a.createElement("div",{className:"renderer",style:{position:"relative"}},o.a.createElement(ke,{fps:z,show:a.showFPS}),o.a.createElement(Ee,{id:"mandelbrot",fragShader:f,useDPR:a.useDPR,u:{zoom:l,xy:r,theta:u,maxI:m},ref:t,fps:C,dragging:p}),o.a.createElement(Oe,{fragShader:g,useDPR:a.useDPR,u:{zoom:l,xy:r,theta:u,maxI:m},canvasRef:n,show:a.showMinimap,onClick:function(){return s({z:1})}}))}))}var _e=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Me(e){if("serviceWorker"in navigator){if(new URL("/mandelbrot-maps",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/mandelbrot-maps","/service-worker.js");_e?(!function(e,t){fetch(e).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):Pe(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):Pe(t,e)}))}}function Pe(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var Ie=function(){var e=o.a.useState(!1),t=Object(c.a)(e,2),n=t[0],r=t[1],i=o.a.useState(null),l=Object(c.a)(i,2),s=l[0],u=l[1],m=function(e){console.log("Out of date version detected! Triggering snackbar."),r(!0),u(e.waiting)};Object(a.useEffect)((function(){console.log("Registering Service Worker for update detection..."),Me({onUpdate:m})}),[]);return o.a.createElement(S.a,{open:n,anchorOrigin:{vertical:"top",horizontal:"center"}},o.a.createElement($.a,{severity:"info",action:o.a.createElement(v.a,{color:"inherit",variant:"outlined",size:"small",onClick:function(){s&&s.postMessage({type:"SKIP_WAITING"}),r(!1),window.location.reload()}},"Update")},"A new version is available!"))},Re=n(25),Ne=n(289),Te=n(290),De=n(253),Fe=n(248),Be=n(291),Ve=n(292),Le=n(215),Xe=n.n(Le),Ue=n(214),qe=n.n(Ue),Ge=n(216),Je=n.n(Ge),Ze=Object(Ne.a)((function(e){return{root:{position:"absolute",bottom:e.spacing(2),right:e.spacing(2),display:"flex",flexDirection:"column",zIndex:2},button:{padding:"6px 12px",marginTop:10},sliderControl:{width:30}}})),He=function(){return o.a.createElement(B.a,{style:{marginTop:10,marginBottom:4}})},Qe=function(e){return o.a.createElement(z.a,{variant:"overline",style:{fontSize:14,marginBottom:4}},e.title)};function Ke(e){var t=Ze(),n=Object(a.useState)(),r=Object(c.a)(n,2),i=r[0],l=r[1],u=function(){return o.a.createElement(v.a,{startIcon:o.a.createElement(qe.a,null),color:"secondary","aria-controls":"reset",onClick:function(){e.reset()},className:t.button},"Reset")},m=function(){return o.a.createElement(v.a,{startIcon:o.a.createElement(Xe.a,null),color:"primary","aria-controls":"about",onClick:function(){e.toggleInfo(),l(void 0)},className:t.button},"About")};return o.a.createElement("div",{className:t.root},o.a.createElement(Te.a,{"aria-controls":"menu","aria-haspopup":"true","aria-label":"settings",size:"small",onClick:function(e){return l(e.currentTarget)}},o.a.createElement(Je.a,null)),o.a.createElement(De.a,{open:Boolean(i)},o.a.createElement(Fe.a,{id:"menu",anchorEl:i,keepMounted:!0,open:Boolean(i),onClose:function(){return l(void 0)},anchorOrigin:{horizontal:"right",vertical:"bottom"},transformOrigin:{vertical:"bottom",horizontal:"right"}},o.a.createElement(s.a,{container:!0,direction:"column",style:{paddingLeft:"1.5em",paddingRight:"1.5em",paddingTop:"1em",paddingBottom:"1em"}},o.a.createElement(s.a,{item:!0,container:!0,alignItems:"center",justify:"space-around"},o.a.createElement(s.a,{item:!0},o.a.createElement(z.a,{variant:"h1",style:{fontSize:20,padding:10}},"Configuration"))),o.a.createElement(me.Consumer,null,(function(e){var t=e.setSettings;return function(e){return[{name:"Interface",widgets:[e.showMinimap,e.showCrosshair,e.showCoordinates,e.showMisiurewiczPoints]},{name:"Graphics",widgets:[e.maxI,e.useDPR,e.useAA,e.showFPS]}]}(e.settingsWidgets).map((function(e){return o.a.createElement(s.a,{item:!0,key:e.name},o.a.createElement(He,null),o.a.createElement(Qe,{title:e.name}),o.a.createElement(Be.a,null,e.widgets.map((function(e){return o.a.createElement(Ve.a,Object.assign({key:"".concat(e.label,"-control"),style:{userSelect:"none"}},e,{onChange:function(n,a){console.log("".concat(e.k," -> ").concat(a)),t((function(t){return Object(ve.a)(Object(ve.a)({},t),{},Object(Re.a)({},e.k,a))}))}}))}))))}))})),o.a.createElement(He,null),o.a.createElement(s.a,{container:!0,direction:"row",justify:"space-between",alignItems:"stretch"},o.a.createElement(s.a,{item:!0},o.a.createElement(u,null)),o.a.createElement(s.a,{item:!0,style:{width:"0.5rem"}}),o.a.createElement(s.a,{item:!0},o.a.createElement(m,null)))))))}var Ye=[[[-.562204,.6428146],100,.3],[[-.1010963,.9562867],200,.3],[[-2,0],70,0],[[-.9870042,-.3129012],1900,.6]],$e=[-.562204,.6428146,-.1010963,.9562867,-2,0,-.9870042,-.3129012];var et=function(){var e=function(){var e="object"===typeof window,t=Object(a.useCallback)((function(){return{width:e?window.innerWidth:void 0,height:e?window.innerHeight:void 0}}),[e]),n=Object(a.useState)(t),o=Object(c.a)(n,2),r=o[0],i=o[1];return Object(a.useEffect)((function(){if(!e)return function(){};function n(){i(t())}return window.addEventListener("resize",n),function(){return window.removeEventListener("resize",n)}}),[t,e]),r}(),t={xyCtrl:Object(u.b)((function(){return{xy:Object(m.vScale)(1/1e-7,d),config:g.default.xy}})),zoomCtrl:Object(u.b)((function(){return{z:85,minZoom:.5,maxZoom:1e5,config:g.default.zoom}})),rotCtrl:Object(u.b)((function(){return{theta:.6,config:g.default.rot}}))},n={xyCtrl:Object(u.b)((function(){return{xy:[0,0],config:g.default.xy}})),zoomCtrl:Object(u.b)((function(){return{z:.5,minZoom:.5,maxZoom:2e3,config:g.default.zoom}})),rotCtrl:Object(u.b)((function(){return{theta:0,config:g.default.rot}}))},r=Object(a.useState)(!1),i=Object(c.a)(r,2),b=i[0],h=i[1];return o.a.createElement(l.a,{theme:pe},o.a.createElement(Ie,null),o.a.createElement(de,null,o.a.createElement(s.a,{container:!0},o.a.createElement(me.Consumer,null,(function(a){var r=a.settings;return o.a.createElement(s.a,{item:!0,container:!0,direction:(e.width||1)<(e.height||0)?"column-reverse":"row",justify:"center",className:"fullSize",style:{position:"absolute"}},o.a.createElement("div",{style:{position:"absolute",left:0,top:0,margin:20,width:"auto"}},o.a.createElement(A,{show:r.showMisiurewiczPoints,mandelbrot:t,julia:n})),o.a.createElement("div",{style:{position:"absolute",right:0,top:0,margin:20,width:"auto"}},o.a.createElement(C,{show:r.showCoordinates,mandelbrot:{xy:t.xyCtrl[0].xy,zoom:t.zoomCtrl[0].z,theta:t.rotCtrl[0].theta}}),o.a.createElement(j,{show:r.showCoordinates,mandelbrot:t})),o.a.createElement(s.a,{item:!0,xs:!0,className:"renderer"},o.a.createElement(We,Object.assign({controls:t},r))),o.a.createElement(s.a,{item:!0,xs:!0,className:"renderer"},o.a.createElement(je,Object.assign({c:t.xyCtrl[0].xy,controls:n},r))))})),o.a.createElement(Ke,{reset:function(){return O(t,f),void O(n,f)},toggleInfo:function(){return h(!b)}}),o.a.createElement(re,{ctrl:[b,h]}))))};i.a.render(o.a.createElement(et,null),document.getElementById("root"))}},[[229,1,2]]]);
//# sourceMappingURL=main.5b6d3a8e.chunk.js.map