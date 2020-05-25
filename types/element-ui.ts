/* eslint-disable import/prefer-default-export */
import { Form } from 'element-ui';
import { RuleItem } from 'async-validator';

export interface ElFormProps<T extends string> extends Form {
  /** Data of form component */
  model: { [P in T]: any };

  /** Validation rules of form */
  rules: { [P in T]: RuleItem[] };
}
