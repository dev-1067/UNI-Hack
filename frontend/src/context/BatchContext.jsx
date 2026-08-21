import React, { createContext, useContext, useState } from 'react';

const BatchContext = createContext();

export const useBatch = () => useContext(BatchContext);

export const BatchProvider = ({ children }) => {
  const [batchStats, setBatchStats] = useState({
    totalSkus: 36,
    enrichedCount: 21, // example: verified (12) + low-conf (9)
    flagged: 5,
    lowConf: 9,
    processing: 10,
    verified: 12,
  });

  return (
    <BatchContext.Provider value={{ batchStats, setBatchStats }}>
      {children}
    </BatchContext.Provider>
  );
};
