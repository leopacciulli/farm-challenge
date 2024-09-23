import * as Yup from 'yup';

const cpfCnpjRegex = /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)/;

export const producerValidationSchema = Yup.object().shape({
  cpfCnpj: Yup.string()
    .matches(cpfCnpjRegex, 'CPF or CNPJ is required')
    .required('CPF or CNPJ is required'),
  name: Yup.string().required('Producer name is required'),
  farmName: Yup.string().required('Farm name is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  totalArea: Yup.number()
    .positive('Total area must be greater than 0')
    .required('Total area is required'),
  agriculturalArea: Yup.number()
    .positive('Agricultural area must be greater than 0')
    .required('Agricultural area is required'),
  vegetationArea: Yup.number()
    .positive('Vegetation area must be greater than 0')
    .required('Vegetation area is required')
    .test('valid-area', 'The sum of arable Agricultural and Vegetation must not be greater than the Total area', function (value) {
      const { totalArea, agriculturalArea } = this.parent;
      return agriculturalArea + value <= totalArea;
    }),
  crops: Yup.array().min(1, 'Choose at least one culture'),
});
