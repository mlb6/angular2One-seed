# Annotations
##Injection
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

## Basic Angular 2 support
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
