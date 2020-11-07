import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Collection {
  requests: string[];
}

const initialState: Collection = { requests: ["one", "two"] };

export const fetchCollectionByPath = createAsyncThunk(
  "collection/fetchByPath",
  async (path: string, thunkAPI) => {
    return { requests: [path] };
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollection: (_state, action: PayloadAction<Collection>) =>
      action.payload,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCollectionByPath.fulfilled,
      (_state, action) => action.payload
    );
  },
});

export const { setCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
