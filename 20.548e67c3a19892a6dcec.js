(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{"W5c+":function(e,n,l){"use strict";l.r(n);var t=l("CcnG"),o=function(){return function(){}}(),i=l("pMnS"),r=l("oBZk"),u=l("ZZ/e"),a=l("gIcY"),d=l("Ip0R"),s=l("ZYCi"),c=l("mrSG"),g=l("fbMX"),m=l("F/XL"),p=l("67Y/"),f=l("yrbL"),h=l("BuPC"),b=l("AytR"),v=l("x2vf"),C=function(){function e(e,n,l){this.request=e,this.storage=n,this.demo=l}return e.prototype.switchTimeline=function(e){if(b.a.demo){var n=this.demo.getJwt(e);return this._handleTimeline(n),Object(m.a)(n).pipe(Object(f.delay)(2e3))}return this.request.get("jwt",{params:{timeline_id:e}}).pipe(Object(p.a)(this._handleTimeline,this))},e.prototype._handleTimeline=function(e){return e.data.apikey&&this.storage.setUser({apikey:e.data.apikey,timelineId:e.data.timeline_id,programId:e.data.program_id}),!0},e.ngInjectableDef=t.defineInjectable({factory:function(){return new e(t.inject(h.a),t.inject(g.b),t.inject(v.a))},token:e,providedIn:"root"}),e}(),R=function(){function e(e,n,l,t){this.storage=e,this.router=n,this.loadingController=l,this.service=t,this.timelineId="",this.programs=[]}return e.prototype.ngOnInit=function(){var e=this;switch(this.router.url){case"/progress":this.currentPage="progress";break;default:this.currentPage="dashboard"}this.timelineId=this.storage.getUser().timelineId,this.programs=[],this.storage.get("programs").forEach(function(n){e.programs.push({id:n.timeline.id,name:n.program.name})})},e.prototype.changeTimeline=function(){return c.__awaiter(this,void 0,void 0,function(){var e;return c.__generator(this,function(n){switch(n.label){case 0:return[4,this.loadingController.create({message:"switching..."})];case 1:return[4,(e=n.sent()).present()];case 2:return n.sent(),this.service.switchTimeline(this.timelineId).subscribe(function(n){e.dismiss(),location.reload()}),[2]}})})},e.prototype.getMyImage=function(){return this.storage.getUser().image?this.storage.getUser().image:"https://my.practera.com/img/user-512.png"},e.prototype.goTo=function(e){switch(e){case"progress":return this.currentPage="progress",this.router.navigate(["progress"]);default:return this.currentPage="dashboard",this.router.navigate(["dashboard"])}},e}(),y=t["\u0275crt"]({encapsulation:0,styles:[[".split-pane-side[_ngcontent-%COMP%]{min-width:auto!important}ion-select[_ngcontent-%COMP%]{max-width:100%;width:100%}"]],data:{}});function D(e){return t["\u0275vid"](0,[(e()(),t["\u0275eld"](0,0,null,null,2,"ion-select-option",[],null,null,null,r.O,r.s)),t["\u0275did"](1,49152,null,0,u.lb,[t.ChangeDetectorRef,t.ElementRef],{value:[0,"value"]},null),(e()(),t["\u0275ted"](2,0,["",""]))],function(e,n){e(n,1,0,n.context.$implicit.id)},function(e,n){e(n,2,0,n.context.$implicit.name)})}function E(e){return t["\u0275vid"](0,[(e()(),t["\u0275eld"](0,0,null,null,46,"ion-split-pane",[],null,null,null,r.Q,r.t)),t["\u0275did"](1,49152,null,0,u.qb,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](2,0,null,0,42,"ion-menu",[["class","drawer"]],null,null,null,r.M,r.p)),t["\u0275did"](3,49152,null,0,u.O,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](4,0,null,0,4,"ion-header",[],null,null,null,r.G,r.j)),t["\u0275did"](5,49152,null,0,u.z,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](6,0,null,0,2,"ion-toolbar",[],null,null,null,r.T,r.w)),t["\u0275did"](7,49152,null,0,u.zb,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](8,0,null,0,0,"img",[["alt","Practera"],["src","./assets/practera-mark.svg"]],null,null,null,null,null)),(e()(),t["\u0275eld"](9,0,null,0,24,"ion-content",[],null,null,null,r.D,r.g)),t["\u0275did"](10,49152,null,0,u.s,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](11,0,null,0,22,"ion-list",[],null,null,null,r.L,r.o)),t["\u0275did"](12,49152,null,0,u.M,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](13,0,null,0,10,"ion-item",[["lines","none"]],null,null,null,r.J,r.m)),t["\u0275did"](14,49152,null,0,u.F,[t.ChangeDetectorRef,t.ElementRef],{lines:[0,"lines"]},null),(e()(),t["\u0275eld"](15,0,null,0,8,"ion-select",[["interface","popover"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ionChange"],[null,"ngModelChange"],[null,"ionBlur"]],function(e,n,l){var o=!0,i=e.component;return"ionBlur"===n&&(o=!1!==t["\u0275nov"](e,17)._handleBlurEvent()&&o),"ionChange"===n&&(o=!1!==t["\u0275nov"](e,17)._handleChangeEvent(l.target.value)&&o),"ionChange"===n&&(o=!1!==i.changeTimeline()&&o),"ngModelChange"===n&&(o=!1!==(i.timelineId=l)&&o),o},r.P,r.r)),t["\u0275did"](16,49152,null,0,u.kb,[t.ChangeDetectorRef,t.ElementRef],{interface:[0,"interface"]},null),t["\u0275did"](17,16384,null,0,u.Ib,[t.ElementRef],null,null),t["\u0275prd"](1024,null,a.b,function(e){return[e]},[u.Ib]),t["\u0275did"](19,671744,null,0,a.e,[[8,null],[8,null],[8,null],[6,a.b]],{model:[0,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,a.c,null,[a.e]),t["\u0275did"](21,16384,null,0,a.d,[[4,a.c]],null,null),(e()(),t["\u0275and"](16777216,null,0,1,null,D)),t["\u0275did"](23,278528,null,0,d.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(e()(),t["\u0275eld"](24,0,null,0,4,"ion-item",[["lines","none"]],null,null,null,r.J,r.m)),t["\u0275did"](25,49152,null,0,u.F,[t.ChangeDetectorRef,t.ElementRef],{lines:[0,"lines"]},null),(e()(),t["\u0275eld"](26,0,null,0,2,"ion-button",[["fill","clear"],["size","large"]],null,[[null,"click"]],function(e,n,l){var t=!0;return"click"===n&&(t=!1!==e.component.goTo("")&&t),t},r.z,r.c)),t["\u0275did"](27,49152,null,0,u.i,[t.ChangeDetectorRef,t.ElementRef],{color:[0,"color"],fill:[1,"fill"],size:[2,"size"]},null),(e()(),t["\u0275ted"](-1,0,["Dashboard"])),(e()(),t["\u0275eld"](29,0,null,0,4,"ion-item",[["lines","none"]],null,null,null,r.J,r.m)),t["\u0275did"](30,49152,null,0,u.F,[t.ChangeDetectorRef,t.ElementRef],{lines:[0,"lines"]},null),(e()(),t["\u0275eld"](31,0,null,0,2,"ion-button",[["fill","clear"],["size","large"]],null,[[null,"click"]],function(e,n,l){var t=!0;return"click"===n&&(t=!1!==e.component.goTo("progress")&&t),t},r.z,r.c)),t["\u0275did"](32,49152,null,0,u.i,[t.ChangeDetectorRef,t.ElementRef],{color:[0,"color"],fill:[1,"fill"],size:[2,"size"]},null),(e()(),t["\u0275ted"](-1,0,["Progress"])),(e()(),t["\u0275eld"](34,0,null,0,10,"ion-footer",[],null,null,null,r.E,r.h)),t["\u0275did"](35,49152,null,0,u.x,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](36,0,null,0,8,"ion-toolbar",[],null,null,null,r.T,r.w)),t["\u0275did"](37,49152,null,0,u.zb,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](38,0,null,0,6,"ion-buttons",[],null,null,null,r.A,r.d)),t["\u0275did"](39,49152,null,0,u.j,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](40,0,null,0,4,"ion-button",[["color","medium"],["fill","clear"],["shape","round"]],null,null,null,r.z,r.c)),t["\u0275did"](41,49152,null,0,u.i,[t.ChangeDetectorRef,t.ElementRef],{color:[0,"color"],fill:[1,"fill"],shape:[2,"shape"]},null),(e()(),t["\u0275eld"](42,0,null,0,2,"ion-avatar",[],null,null,null,r.y,r.b)),t["\u0275did"](43,49152,null,0,u.e,[t.ChangeDetectorRef,t.ElementRef],null,null),(e()(),t["\u0275eld"](44,0,null,0,0,"img",[["alt","Admin"]],[[8,"src",4]],null,null,null,null)),(e()(),t["\u0275eld"](45,16777216,null,0,1,"ion-router-outlet",[["main",""]],null,null,null,null,null)),t["\u0275did"](46,212992,null,0,u.fb,[s.b,t.ViewContainerRef,t.ComponentFactoryResolver,[8,null],[8,null],t.ChangeDetectorRef,u.c,u.Fb,t.ElementRef,s.m,t.NgZone,s.a,[3,u.fb]],null,null)],function(e,n){var l=n.component;e(n,14,0,"none"),e(n,16,0,"popover"),e(n,19,0,l.timelineId),e(n,23,0,l.programs),e(n,25,0,"none"),e(n,27,0,"dashboard"===l.currentPage?"dark":"medium","clear","large"),e(n,30,0,"none"),e(n,32,0,"progress"===l.currentPage?"dark":"medium","clear","large"),e(n,41,0,"medium","clear","round"),e(n,46,0)},function(e,n){var l=n.component;e(n,15,0,t["\u0275nov"](n,21).ngClassUntouched,t["\u0275nov"](n,21).ngClassTouched,t["\u0275nov"](n,21).ngClassPristine,t["\u0275nov"](n,21).ngClassDirty,t["\u0275nov"](n,21).ngClassValid,t["\u0275nov"](n,21).ngClassInvalid,t["\u0275nov"](n,21).ngClassPending),e(n,44,0,l.getMyImage())})}function w(e){return t["\u0275vid"](0,[(e()(),t["\u0275eld"](0,0,null,null,1,"app-menu",[],null,null,null,E,y)),t["\u0275did"](1,114688,null,0,R,[g.b,s.m,u.Db,C],null,null)],function(e,n){e(n,1,0)},null)}var I=t["\u0275ccf"]("app-menu",R,w,{},{},[]),k=l("PCNd"),M=function(){function e(e,n){this.router=e,this.storage=n}return e.prototype.canActivate=function(e,n){if(b.a.demo){if(this.storage.getUser().apikey&&this.storage.getUser().apikey.includes("demo-apikey")&&this.storage.get("expire")){var l=new Date(this.storage.get("expire"));new Date>l&&this.router.navigate(["auth","demo"])}else this.router.navigate(["auth","demo"]);return!0}return this.storage.getUser().apikey||this.router.navigate(["error"]),!0},e.prototype.canActivateChild=function(e,n){return this.canActivate(e,n)},e.ngInjectableDef=t.defineInjectable({factory:function(){return new e(t.inject(s.m),t.inject(g.b))},token:e,providedIn:"root"}),e}(),_=function(){return function(){}}();l.d(n,"MenuModuleNgFactory",function(){return j});var j=t["\u0275cmf"](o,[],function(e){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[i.a,I]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,d.NgLocalization,d.NgLocaleLocalization,[t.LOCALE_ID,[2,d["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,u.b,u.b,[t.NgZone,t.ApplicationRef]),t["\u0275mpd"](4608,u.Eb,u.Eb,[u.b,t.ComponentFactoryResolver,t.Injector,d.DOCUMENT]),t["\u0275mpd"](4608,u.Hb,u.Hb,[u.b,t.ComponentFactoryResolver,t.Injector,d.DOCUMENT]),t["\u0275mpd"](4608,a.g,a.g,[]),t["\u0275mpd"](4608,g.b,g.b,[g.a]),t["\u0275mpd"](1073742336,d.CommonModule,d.CommonModule,[]),t["\u0275mpd"](1073742336,u.Bb,u.Bb,[]),t["\u0275mpd"](1073742336,a.f,a.f,[]),t["\u0275mpd"](1073742336,a.a,a.a,[]),t["\u0275mpd"](1073742336,k.a,k.a,[]),t["\u0275mpd"](1073742336,s.n,s.n,[[2,s.t],[2,s.m]]),t["\u0275mpd"](1073742336,_,_,[]),t["\u0275mpd"](1073742336,o,o,[]),t["\u0275mpd"](1024,s.k,function(){return[[{path:"",component:R,canActivate:[M],children:[{path:"dashboard",loadChildren:"../home/home.module#HomeModule"},{path:"progress",loadChildren:"../progress/progress.module#ProgressModule"},{path:"",redirectTo:"dashboard"}]}]]},[])])})}}]);