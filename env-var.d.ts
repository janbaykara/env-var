
declare function E (varName: string, defaultValue?: string): E.IVariable;

declare namespace E {

  interface IVariable {
    required: () => IVariable,
    asInt: () => number,
    asFloat: () => number,
    asPositiveInt: () => number,
    asNegativeInt: () => number,
    asString: () => string,
    asJson: () => Object|Array<any>,
    asBool: () => boolean,
    asStrictBool: () => boolean,
  }

  function mock (mockValues: Object): (varName: string, defaultValue?: string) => E.IVariable;

}

export = E;
