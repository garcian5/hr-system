import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';

import Home from './components/Home';
import AddMore from './components/AddMore';

import Companies from './components/routes/Companies';
import Departments from './components/routes/Departments';
import Employees from './components/routes/Employees';

import EnterCompany from './components/entries/EnterCompany';
import EnterDepartment from './components/entries/EnterDepartment';
import EnterEmployee from './components/entries/EnterEmployee';
import EnterImage from './components/entries/EnterImage';

import TestDept from './components/test/TestDept';
import TestComp from './components/test/TestComp';
import TestUpdateEmp from './components/test/TestUpdateEmp';

import UpdateEmployee from './components/update/UpdateEmployee';
import EmployeeInfo from './components/employeeinfo/EmployeeInfo';
import Test from './components/test/Test';

import UpdateCompany from './components/update/UpdateCompany';

// new design
import DeptByComp from './components/newcomponents/DeptByComp'

function App() {
  return (
    <div className="App">      
      <Router>
        <NavBar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/companies" component={Companies} />
          <Route path="/departments" component={Departments} />
          <Route path="/employees" component={Employees} />
          <Route path="/addmore" component={AddMore} />

          <Route path="/comp-entry" component={EnterCompany} />
          <Route path="/dept-entry" component={EnterDepartment} />
          <Route path="/emp-entry" component={EnterEmployee} />
          <Route path="/img-entry" component={EnterImage} />

          <Route path="/comp-update" component={UpdateCompany} />        

          <Route path="/update-emp" component={UpdateEmployee} />
          <Route path="/emp-info" component={EmployeeInfo} />

          <Route path="/test-img" component={Test} />
          <Route path="/test-dept" component={TestDept} />
          <Route path="/test-comp" component={TestComp} />          
          <Route path="/test-update-emp" component={TestUpdateEmp} />

          {/*This is the new design routes*/}
          <Route path="/dept-by-comp" component={DeptByComp} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
