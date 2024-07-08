import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterActive, fetchFilters, filterSelector } from './filterSlice';
import classNames from 'classnames';

import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
  const dispatch = useDispatch();

  const filters = useSelector(filterSelector);
  const { filtersLoadingStatus, activeFilter } = useSelector(
    (state) => state.filters
  );

  useEffect(() => {
    dispatch(fetchFilters());

    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === 'loading') {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  } else if (filtersLoadingStatus === 'error') {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFiltersList = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Фильтров пока нет</h5>;
    }
    return arr.map(({ name, label, className }) => {
      const btnClass = classNames('btn', `btn-${className}`, {
        active: name === activeFilter,
      });
      return (
        <button
          className={btnClass}
          key={name}
          id={name}
          onClick={() => dispatch(filterActive(name))}
        >
          {label}
        </button>
      );
    });
  };

  const filtersList = renderFiltersList(filters);
  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{filtersList}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
