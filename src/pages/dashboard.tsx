import { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import { useAuth } from '../hooks/auth';
import api from '../services/api';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    'semana 1': 2780,
    'semana 2': 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    'semana 1': 1890,
    'semana 2': 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Dashboard(): JSX.Element {
  const { signOut, user } = useAuth();
  const [appointmentsInfo, setAppointmentsInfo] = useState();

  useEffect(() => {
    if (user) {
      api
        .get(`appointments/info/${user.id}`, {
          params: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        })
        .then((response) => setAppointmentsInfo(response.data));
    }
  }, [user]);

  return (
    <>
      <h1>Hello Dashboard</h1>
      <button onClick={signOut}>Logout</button>

      {console.log(appointmentsInfo)}

      {/* <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart> */}

      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="semana 1" stroke="#8884d8" />
        <Line type="monotone" dataKey="semana 2" stroke="#82ca9d" />
      </LineChart>
    </>
  );
}
