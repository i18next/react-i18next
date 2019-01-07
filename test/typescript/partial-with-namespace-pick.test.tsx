import * as React from "react";
import { WithNamespaces, withNamespaces } from "../../src";

interface IProps extends Pick<WithNamespaces, "t"> {
  translationKey: string;
}

// translation function t can be partially picked from WithNamespaces interface
// so that not everything needs to be passed into the component when writing tests for it
function MyComponent({ t, translationKey }: IProps) {
    return <div>{t(translationKey)}</div>;
}

const MyComponentWrapped = withNamespaces()(MyComponent);

function App() {
  return <MyComponentWrapped translationKey="some-translation-key" />;
}
