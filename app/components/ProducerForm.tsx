import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { addProducer, updateProducer } from '../store/producersSlice'
import { producerValidationSchema } from '../utils/validation'
import { Producer, cropsOptions } from '../types/producer'
import InputMask from 'react-input-mask'
import styled from 'styled-components'
import brasilApi from '../api/brasilapi'
import { states } from '../utils/states'

interface ProducerFormProps {
  producer?: Producer | null
  resetTab: () => void
}

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
  error?: boolean
}

interface Cities {
  nome: string
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  margin: 0 auto;
  padding: 0px 16px 16px 16px;
  max-width: 900px;
  .masked-input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    &:focus {
      border-color: #007bff;
    }
  }
  .masked-error {
    border: 1px solid #fc2323;
  }
`

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-top: 16px;
`

const Input = styled.input<{ error?: boolean }>`
  padding: 8px;
  font-size: 16px;
  border: 1px solid ${(props) => (props.error ? '#fc2323' : '#ccc')};
  border-radius: 4px;
  outline: none;
  margin-top: 4px;
  &:focus {
    border-color: #007bff;
  }
`

const Select = styled.select<{ error?: boolean }>`
  padding: 8px;
  font-size: 16px;
  border: 1px solid ${(props) => (props.error ? '#fc2323' : '#ccc')};
  border-radius: 4px;
  outline: none;
  margin-top: 4px;
  &:focus {
    border-color: #007bff;
  }
`

const ErrorMessage = styled.div`
  color: #fc2323;
  font-size: 12px;
  margin-top: 2px;
`

const AreaContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 24px;
  margin-top: 16px;
  input {
    width: 100%;
  }
  @media (max-width: 610px) {
    grid-template-columns: auto;
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 32px;
  &:hover {
    background-color: #0056b3;
  }
`

const MaskedInput: React.FC<MaskedInputProps> = ({ mask, ...props }) => {
  return <InputMask mask={mask} {...props} />
}

const ProducerForm: React.FC<ProducerFormProps> = ({ producer, resetTab }) => {
  const [cpfCnpjMask, setCpfCnpjMask] = useState(
    producer && producer.cpfCnpj.length === 18
      ? '99.999.999/9999-99'
      : '999.999.999-99'
  )
  const [cities, setCities] = useState<Cities[]>([])
  const dispatch = useDispatch()

  const formik = useFormik<Producer>({
    initialValues: {
      cpfCnpj: producer?.cpfCnpj || '',
      name: producer?.name || '',
      farmName: producer?.farmName || '',
      city: producer?.city || '',
      state: producer?.state || '',
      totalArea: producer?.totalArea || 0,
      agriculturalArea: producer?.agriculturalArea || 0,
      vegetationArea: producer?.vegetationArea || 0,
      crops: producer?.crops || [],
    },
    validationSchema: producerValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (producer) {
        dispatch(updateProducer(values))
      } else {
        dispatch(addProducer(values))
      }
      resetTab()
      resetForm()
    },
  })

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.includes('000')) {
      setCpfCnpjMask('99.999.999/9999-99')
    } else {
      setCpfCnpjMask('999.999.999-99')
    }

    formik.handleChange(e)
  }

  useEffect(() => {
    async function load() {
      const stateValue = formik.values.state.split('-')[1]
      const state = stateValue ? stateValue.trim() : 'AC'
      const response = await brasilApi.get(`/${state}`)

      if (!producer || formik.values.state !== producer?.state) {
        setCities(response.data)
        formik.setFieldValue('city', response.data[0].nome)
      } else if (producer?.city) {
        formik.setFieldValue('city', producer?.city)
        setCities([{ nome: producer.city }, ...response.data])
      }
    }
    load()
  }, [formik.values.state])

  return (
    <FormWrapper onSubmit={formik.handleSubmit}>
      <Label style={{ marginBottom: 4 }} htmlFor="cpfCnpj">
        CPF or CNPJ
      </Label>
      <MaskedInput
        id="cpfCnpj"
        name="cpfCnpj"
        mask={cpfCnpjMask}
        value={formik.values.cpfCnpj}
        onChange={handleCpfCnpjChange}
        onBlur={formik.handleBlur}
        disabled={!!producer}
        className={`masked-input ${
          formik.touched.cpfCnpj && Boolean(formik.errors.cpfCnpj)
            ? 'masked-error'
            : ''
        }`}
      />
      {formik.touched.cpfCnpj && formik.errors.cpfCnpj && (
        <ErrorMessage>{formik.errors.cpfCnpj}</ErrorMessage>
      )}

      <Label htmlFor="name">Producer name</Label>
      <Input
        id="name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
      />
      {formik.touched.name && formik.errors.name && (
        <ErrorMessage>{formik.errors.name}</ErrorMessage>
      )}

      <Label htmlFor="farmName">Farm name</Label>
      <Input
        id="farmName"
        name="farmName"
        value={formik.values.farmName}
        onChange={formik.handleChange}
        error={formik.touched.farmName && Boolean(formik.errors.farmName)}
      />
      {formik.touched.farmName && formik.errors.farmName && (
        <ErrorMessage>{formik.errors.farmName}</ErrorMessage>
      )}

      <Label htmlFor="state">State</Label>
      <Select
        id="state"
        name="state"
        value={formik.values.state}
        onChange={formik.handleChange}
        error={formik.touched.state && Boolean(formik.errors.state)}
      >
        {states.map((state) => {
          return (
            <option key={state.value}>
              {state.name ? `${state.name} - ${state.value}` : ''}
            </option>
          )
        })}
      </Select>
      {formik.touched.state && formik.errors.state && (
        <ErrorMessage>{formik.errors.state}</ErrorMessage>
      )}

      {formik.values.state && (
        <>
          <Label htmlFor="city">City</Label>
          <Select
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
          >
            {cities.map((city) => {
              const name =
                city.nome.charAt(0).toUpperCase() +
                city.nome.slice(1).toLowerCase()
              return <option key={city.nome}>{name}</option>
            })}
          </Select>
        </>
      )}

      <AreaContainer>
        <div>
          <div>
            <Label htmlFor="totalArea">Total area (ha)</Label>
          </div>
          <Input
            id="totalArea"
            name="totalArea"
            type="number"
            value={formik.values.totalArea}
            onChange={formik.handleChange}
            error={formik.touched.totalArea && Boolean(formik.errors.totalArea)}
          />
          {formik.touched.totalArea && formik.errors.totalArea && (
            <ErrorMessage>{formik.errors.totalArea}</ErrorMessage>
          )}
        </div>

        <div>
          <div>
            <Label htmlFor="agriculturalArea">Agricultural area (ha)</Label>
          </div>
          <Input
            id="agriculturalArea"
            name="agriculturalArea"
            type="number"
            value={formik.values.agriculturalArea}
            onChange={formik.handleChange}
            error={
              formik.touched.agriculturalArea &&
              Boolean(formik.errors.agriculturalArea)
            }
          />
          {formik.touched.agriculturalArea &&
            formik.errors.agriculturalArea && (
              <ErrorMessage>{formik.errors.agriculturalArea}</ErrorMessage>
            )}
        </div>

        <div>
          <div>
            <Label htmlFor="vegetationArea">Vegetation area (ha)</Label>
          </div>
          <Input
            id="vegetationArea"
            name="vegetationArea"
            type="number"
            value={formik.values.vegetationArea}
            onChange={formik.handleChange}
            error={
              formik.touched.vegetationArea &&
              Boolean(formik.errors.vegetationArea)
            }
          />
          {formik.touched.vegetationArea && formik.errors.vegetationArea && (
            <ErrorMessage>{formik.errors.vegetationArea}</ErrorMessage>
          )}
        </div>
      </AreaContainer>

      <Label>Planted Crops</Label>
      <CheckboxWrapper>
        {cropsOptions.map((crop) => (
          <CheckboxLabel key={crop}>
            <input
              type="checkbox"
              name="crops"
              value={crop}
              onChange={formik.handleChange}
              checked={formik.values.crops.includes(crop)}
            />
            {crop}
          </CheckboxLabel>
        ))}
      </CheckboxWrapper>
      {formik.touched.crops && formik.errors.crops && (
        <ErrorMessage>{formik.errors.crops}</ErrorMessage>
      )}

      <SubmitButton type="submit">
        {producer ? 'Update' : 'Create'} Producer
      </SubmitButton>
    </FormWrapper>
  )
}

export default ProducerForm
