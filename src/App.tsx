import "./App.css";
import { Route, Switch } from "wouter";
import { TurnTable } from "./pages/TurnTable";
import { Home } from "./pages/Home";

export default () => (
  <>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/turn" component={TurnTable} />
    </Switch>
    <footer>
      作者： <a href="https://github.com/KanbeKotoriDaisuki">神戸小鳥大好き</a>
    </footer>
  </>
);
