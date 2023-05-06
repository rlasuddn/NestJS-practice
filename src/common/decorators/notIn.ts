import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

/**
 *
 * @param property 객체에서 참조하려고 하는 다른 속성의 이름
 * @param validationOptions
 * @returns
 */

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  //registerDecorator를 호출하는 함수를 리턴. 이 함수의 인수로 데커레이터가 선언될 객체와 속성 이름을 받는다.
  return (object: Object, propertyName: string) => {
    // 데코레이터 생성
    //registerDecorator 함수는 ValidationDecoratorOptions 객체를 인수로 받는다. {name, target, propertyName ...}
    registerDecorator({
      name: 'NotIn', //데커레이터의 이름
      target: object.constructor, //이 데커레이터는 객체가 생성될 때 적용된다.
      propertyName,
      options: validationOptions, //유효성 옵션은 데커레이터의 인수로 전달받은 것을 적용
      constraints: [property], //이 데커레이터는 속성에 적용되도록 제약
      validator: {
        // 유효성 검사 규칙이 validator 속성에 기술. ValidatorConstraint Interface를 구현한 함수.
        // value는 검증할 값 args는 ValidationArguments객체
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
