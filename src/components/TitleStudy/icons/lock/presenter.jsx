import React from 'react';
import BEMHelper from 'services/BemHelper';
import classnames from 'classnames';

function IconLock({ className = '', isPrivate = false } = {}) {
  const classes = BEMHelper('title-study-ico-lock');
  const tooltipClass = BEMHelper('tooltip');

  const classesParams = {
    modifiers: { locked: isPrivate },
    extra: classnames(tooltipClass().className, className),
  };

  return (
    <div
      {...classes(classesParams)}
      aria-label={isPrivate ? 'Private' : 'Public'}
      data-tootik-conf="right"
    >
      {isPrivate ? 'lock' : 'lock_open'}
    </div>
  );
}

export default IconLock;
