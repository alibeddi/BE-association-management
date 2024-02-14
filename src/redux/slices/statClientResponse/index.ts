import { createSlice } from '@reduxjs/toolkit';
import { Meta, PaginationModel } from '../../../@types/Pagination';
import { StatClientResponse } from '../../../@types/StatClientResponse';
import { IStatus } from '../../../@types/status';
import { createStatClientResponse, getAllStatClientResponses } from './actions';

type StatClientResState = {
  statClientResponses: PaginationModel<StatClientResponse>;
  statClientResponse: StatClientResponse | null;
  status: IStatus;
};

const initialState: StatClientResState = {
  statClientResponses: { docs: [], meta: {} as Meta },
  statClientResponse: null,
  status: IStatus.IDLE,
};

const slice = createSlice({
  name: 'statClientResponses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // create
    builder
      .addCase(createStatClientResponse.pending, (state) => {
        state.status = IStatus.FAILED;
      })
      .addCase(createStatClientResponse.fulfilled, (state, action) => {
        state.status = IStatus.SUCCEEDED;
        state.statClientResponse = action.payload.data;
      })
      .addCase(createStatClientResponse.rejected, (state) => {
        state.status = IStatus.FAILED;
      });
    // get all
    builder
      .addCase(getAllStatClientResponses.pending, (state) => {
        state.status = IStatus.FAILED;
      })
      .addCase(getAllStatClientResponses.fulfilled, (state, action) => {
        state.status = IStatus.SUCCEEDED;
        state.statClientResponses = action.payload.data;
      })
      .addCase(getAllStatClientResponses.rejected, (state) => {
        state.status = IStatus.FAILED;
      });
  },
});

export default slice.reducer;
