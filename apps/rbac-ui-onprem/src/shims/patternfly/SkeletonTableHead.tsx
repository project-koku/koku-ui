import React from 'react';

/** Minimal thead — avoids PF ThBase width loop when federated. */
const SkeletonTableHead: React.FC<Record<string, unknown>> = () => <thead aria-hidden />;

export default SkeletonTableHead;
