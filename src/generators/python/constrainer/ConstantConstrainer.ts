import {
  ConstrainedMetaModel,
  ConstrainedEnumModel,
  ConstrainedMetaModelOptionsConst,
  ConstrainedReferenceModel,
  ConstrainedStringModel
} from '../../../models';
import { PythonConstantConstraint } from '../PythonGenerator';

const getConstrainedEnumModelConstant = (args: {
  constrainedMetaModel: ConstrainedMetaModel;
  constrainedEnumModel: ConstrainedEnumModel;
  constOptions: ConstrainedMetaModelOptionsConst;
}) => {
  const constrainedEnumValueModel = args.constrainedEnumModel.values.find(
    (value) => value.originalInput === args.constOptions.originalInput
  );

  if (constrainedEnumValueModel) {
    return `${args.constrainedMetaModel.type}.${constrainedEnumValueModel.key}`;
  }
};

export function defaultConstantConstraints(): PythonConstantConstraint {
  return ({ constrainedMetaModel }) => {
    const constOptions = constrainedMetaModel.options.const;

    if (!constOptions) {
      return undefined;
    }

    if (
      constrainedMetaModel instanceof ConstrainedReferenceModel &&
      constrainedMetaModel.ref instanceof ConstrainedEnumModel
    ) {
      return getConstrainedEnumModelConstant({
        constrainedMetaModel,
        constrainedEnumModel: constrainedMetaModel.ref,
        constOptions
      });
    } else if (constrainedMetaModel instanceof ConstrainedEnumModel) {
      return getConstrainedEnumModelConstant({
        constrainedMetaModel,
        constrainedEnumModel: constrainedMetaModel,
        constOptions
      });
    } else if (constrainedMetaModel instanceof ConstrainedStringModel) {
      return `'${constOptions.originalInput}'`;
    }

    return undefined;
  };
}
