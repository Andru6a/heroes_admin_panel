import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';


const filterAdapter = createEntityAdapter({
  selectId: (filter) => filter.name,
});

const initialState = filterAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all',
});

export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async () => {
    const { request } = useHttp();
    return await request('http://localhost:3001/filters');
  }
);

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    filterActive: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.filtersLoadingStatus = 'loading';
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filtersLoadingStatus = 'idle';
        filterAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilters.rejected, (state) => {
        state.filtersLoadingStatus = 'error';
      });
  },
});

const { actions, reducer } = filterSlice;

export const filterSelector = filterAdapter.getSelectors(state => state.filters).selectAll

export default reducer;
export const {
  filterActive,
} = actions;
