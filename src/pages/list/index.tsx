import React from 'react';
import styles from './index.scss?local';

type ItemProps = {
  id: number;
  name: string;
};

type Props = {
  items: ItemProps[];
};

function List({ items }: Props): JSX.Element {
  return (
    <ul className={styles.list}>
      {items.map(item => {
        return <li key={item.id}>{item.name}</li>;
      })}
    </ul>
  );
}

List.defaultProps = {
  items: [
    {
      id: 1,
      name: 'item1',
    },
    {
      id: 2,
      name: 'item2',
    },
  ],
};

export default List;
