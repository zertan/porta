// @flow

import React from 'react'
import Form from 'react-jsonschema-form'

import { isNotApicastPolicy } from 'Policies/components/util'
import { HeaderButton } from 'Policies/components/HeaderButton'

import type { ThunkAction, ChainPolicy } from 'Policies/types'
import type { UpdatePolicyConfigAction } from 'Policies/actions/PolicyConfig'

class PolicyForm extends Form {
  // TODO: this method will be renamed to UNSAFE_componentWillReceiveProps in 1.9 and eventually removed.
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.schema !== this.state.schema) {
      this.setState({...this.getStateFromProps(nextProps), ...{errors: []}})
    }
  }
}

type Props = {
  schema?: string,
  policy: ChainPolicy,
  submitForm: (ChainPolicy) => ThunkAction,
  removePolicy: (ChainPolicy) => ThunkAction,
  closePolicyConfig: () => ThunkAction,
  updatePolicy: (ChainPolicy) => UpdatePolicyConfigAction
}

function PoliciesForm ({
  policy, submitForm, updatePolicy, removePolicy,
  closePolicyConfig}: Props) {
  const onSubmit = (policy) => {
    return ({formData, schema}) => {
      submitForm({...policy, ...{configuration: schema, data: formData}})
    }
  }
  const togglePolicy = (event) => {
    updatePolicy({...policy, ...{enabled: event.target.checked}})
  }
  const remove = () => removePolicy(policy)
  const cancel = () => closePolicyConfig()

  const isPolicyVisible = isNotApicastPolicy(policy)

  return (
    <section className="PolicyConfiguration">
      <header>
        <h2>Edit Policy</h2>
        <HeaderButton type='cancel' onClick={cancel}>
          Cancel
        </HeaderButton>
      </header>
      <h2 className="PolicyConfiguration-name">{policy.humanName}</h2>
      <p className="PolicyConfiguration-version-and-summary">
        <span className="PolicyConfiguration-version">{policy.version}</span>
        {' - '}
        <span className="PolicyConfiguration-summary">{policy.summary}</span>
      </p>
      <p className="PolicyConfiguration-description">{policy.description}</p>
      {isPolicyVisible &&
        <label className="Policy-status" htmlFor="policy-enabled">
          <input
            id="policy-enabled" name="policy-enabled" type="checkbox"
            checked={policy.enabled}
            onChange={togglePolicy}
          />
          {' '} Enabled
        </label>
      }
      {isPolicyVisible &&
        <PolicyForm
          className="PolicyConfiguration-form"
          schema={policy.configuration}
          formData={policy.data}
          onSubmit={onSubmit(policy)}
        >
          <button className='btn btn-info' type="submit">Update Policy</button>
        </PolicyForm>
      }
      {policy.removable &&
        <div
          className="PolicyConfiguration-remove btn btn-danger btn-sm"
          onClick={remove}>
          <i className="fa fa-trash"></i> Remove
        </div>
      }
    </section>
  )
}

export { PolicyForm, PoliciesForm }