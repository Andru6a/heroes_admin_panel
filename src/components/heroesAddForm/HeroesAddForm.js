import { useSelector } from 'react-redux';
import { filterSelector } from '../heroesFilters/filterSlice';
import { useCreateHeroeMutation } from '../../api/apiSlice';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const HeroesAddForm = () => {
  const filters = useSelector(filterSelector);
  const filtersLoadingStatus = useSelector(
    (state) => state.filters.filtersLoadingStatus
  );

  const [createHero, { isLoading }] = useCreateHeroeMutation();

  const renderOptionsList = (filters, status) => {
    if (status === 'loading') {
      return <option>Загрузка элементов</option>;
    } else if (status === 'error') {
      return <option>Ошибка загрузки</option>;
    }

    if (filters.length > 0 && filters) {
      return filters.map(({ name, label }) => {
        if (name === 'all') return null;
        return (
          <option value={name} key={name}>
            {label}
          </option>
        );
      });
    }
  };

  const onSubmit = (values, setSubmitting, resetForm) => {
    let id = uuidv4();
    const newHero = { id, ...values };

    createHero(newHero)
      .unwrap()
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };

  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        element: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(2, 'Минимум 2 символа')
          .required('Обязательное поле!'),
        description: Yup.string()
          .min(5, 'Не менее 5 символов')
          .required('Обязательное поле!'),
        element: Yup.string()
          .required('Выберите элемент')
          .required('Обязательное поле!'),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(values, setSubmitting, resetForm);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="border p-4 shadow-lg rounded">
          <div className="mb-3">
            <label htmlFor="name" className="form-label fs-4">
              Имя нового героя
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="Как меня зовут?"
            />
            <ErrorMessage className="error__form" name="name" component="div" />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fs-4">
              Описание
            </label>
            <Field
              id="description"
              name="description"
              as="textarea"
              className="form-control"
              placeholder="Что я умею?"
              style={{ height: '130px' }}
            />
            <ErrorMessage
              className="error__form"
              name="description"
              component="div"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="element" className="form-label">
              Выбрать элемент героя
            </label>
            <Field
              id="element"
              name="element"
              as="select"
              className="form-control"
            >
              <option value="">Я владею элементом...</option>
              {renderOptionsList(filters, filtersLoadingStatus)}
            </Field>
            <ErrorMessage
              className="error__form"
              name="element"
              component="div"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            Создать
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default HeroesAddForm;
