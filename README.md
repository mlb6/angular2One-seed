# Seed for angularjs 1.x project written in atScript with angular 2 annotations [WIP]

[![Build Status](https://travis-ci.org/mlb6/angular2One-seed.svg?branch=master)](https://travis-ci.org/mlb6/angular2One-seed)  [![Coverage Status](https://img.shields.io/coveralls/mlb6/angular2One-seed.svg?style=flat)](https://coveralls.io/r/mlb6/angular2One-seed) [![Dependency Status](https://david-dm.org/mlb6/angular2One-seed.svg?style=flat)](https://david-dm.org/mlb6/angular2One-seed) [![devDependency Status](https://david-dm.org/mlb6/angular2One-seed/dev-status.svg?style=flat)](https://david-dm.org/mlb6/angular2One-seed#info=devDependencies) [![Sauce Test Status](https://saucelabs.com/buildstatus/mlb6)](https://saucelabs.com/u/mlb6)

This seed is using :
 - requireJS for AMD modules
 - the angular new router
 - angular material design.
 
 The aim was to be able to use angular 2 hello world example with angular 1.

## Annotations
### @InjectNgOne('serviceName')
```javascript
class Hello{
  logger:Object;
  
  constructor(@InjectNgOne('$log') $log){
    this.logger=$log;
  }
}
```

### @Inject(Type)
```javascript
class Hello{
  logger:Logger;

  constructor(@Inject(Logger) logger){
    this.logger=logger;
  }
}
```


### @Component
```javascript
@Component({
  // The Selector prop tells Angular on which elements to instantiate this
  // class. The syntax supported is a basic subset of CSS selectors, for example
  // 'element', '[attr]', [attr=foo]', etc.
  selector: 'hello-app',
  // These are services that would be created if a class in the component's
  // template tries to inject them.
  componentServices: [GreetingService],
  template: new TemplateConfig({
    // The template for the component.
    // Expressions in the template (like {{greeting}}) are evaluated in the
    // context of the HelloCmp class below.
    inline: `{{greeting}} <span red>world</span>!`,
    // All directives used in the template need to be specified. This allows for
    // modularity (RedDec can only be used in this template)
    // and better tooling (the template can be invalidated if the attribute is
    // misspelled).
    directives: [RedDec]
  })
})
export class HelloCmp {
  greeting: string;
  constructor(service: GreetingService) {
    this.greeting = service.greeting;
  }
}
```

### @Decorator
```javascript
// Decorators are light-weight. They don't allow for templates, or new
// expression contexts (use @Component or @Template for those needs).
@Decorator({
  selector: '[red]'
})
class RedDec {
  // NgElement is always injectable and it wraps the element on which the
  // directive was found by the compiler.
  constructor(el: NgElement) {
    el.domElement.style.color = 'red';
  }
}
```
 
## Build
1. `npm install`
2. `bower install`
3. `gulp build-dev`
4. `gulp serve`

Production build and test build are not ready yet.

## Issues
Do not open issues yet. It is experimental, and a work in progress.
Suggestions are welcome.

## Contributing
Contact me if you want to contribute.
