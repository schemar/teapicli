import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text } from "ink";

import { RootState } from "../store/store";
import { fetchCollectionByPath } from "../store/collectionSlice";

export default () => {
  const { requests } = useSelector((state: RootState) => state.collection);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollectionByPath("./path"));
  }, []);

  return (
    <>
      {requests.map((request) => (
        <Text key={request}>{request}</Text>
      ))}
    </>
  );
};
