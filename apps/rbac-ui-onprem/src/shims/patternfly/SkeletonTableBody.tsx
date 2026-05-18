import React from 'react';

/** Minimal tbody — used by RolesTable and other package-root imports. */
const SkeletonTableBody: React.FC<{ rowsCount?: number; columnsCount?: number }> = () => (
  <tbody aria-hidden>
    <tr>
      <td colSpan={99} style={{ padding: '1.5rem', textAlign: 'center' }}>
        …
      </td>
    </tr>
  </tbody>
);

export default SkeletonTableBody;
