import React, { useEffect, useState } from 'react';
import { useImported } from 'react-imported-component';
import { StoreType } from './createStore';

interface ArgsType {
  store: StoreType;
  component: () => any;
  models: () => any[];
}

function Loading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return loading && <div>加载中...</div>;
}

export default function({
  store,
  component,
  models: m = () => [],
}: ArgsType): any {
  const loader = () => {
    return Promise.all([component(), ...m()]).then(([c, ...models]) => {
      if (models.length > 0) {
        models.forEach(model => {
          store.injectModel(model.default.namespace, model.default);
        });
      }

      return c;
    });
  };

  function DynamicWrapper({ ...props }) {
    const { imported: Component, loading } = useImported(loader);

    if (loading) {
      return <Loading />;
    }

    return <Component {...props} />;
  }

  return DynamicWrapper;
}
