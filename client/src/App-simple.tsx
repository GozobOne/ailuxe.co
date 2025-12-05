import { Route, Switch } from "wouter";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <div style={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: '24px'
        }}>
          404 - Page Not Found
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return <Router />;
}
