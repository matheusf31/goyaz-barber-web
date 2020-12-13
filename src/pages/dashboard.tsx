import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { addMonths, format, subMonths } from 'date-fns';

import { useAuth } from '../hooks/auth';
import api from '../services/api';
import { IAppointmentExtraDailyInfo } from './dtos/IAppointmentsDailyInfo';

type IData = Array<
  {
    name: string;
    week_1: number;
    week_2: number;
    week_3: number;
    week_4: number;
    week_5: number;
    week_6: number;
  } & {
    [key: string]: number;
  }
>;

export default function Dashboard(): JSX.Element {
  const { signOut, user } = useAuth();

  const [appointmentsInfo, setAppointmentsInfo] = useState<IAppointmentExtraDailyInfo>();
  const [data, setData] = useState<IData>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      api
        .get(`appointments/daily/info/${user.id}`, {
          params: {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
        })
        .then((response) => setAppointmentsInfo(response.data));
    }
  }, [user, date]);

  useEffect(() => {
    const updatedData = [
      {
        name: 'monday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
      {
        name: 'tuesday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
      {
        name: 'wednesday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
      {
        name: 'thursday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
      {
        name: 'friday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
      {
        name: 'saturday',
        week_1: 0,
        week_2: 0,
        week_3: 0,
        week_4: 0,
        week_5: 0,
        week_6: 0,
      },
    ] as IData;

    updatedData.forEach((day) => {
      for (let index = 1; index <= 6; index++) {
        const weekName = `week_${index}`;

        if (appointmentsInfo && appointmentsInfo[weekName]) {
          day[weekName] = appointmentsInfo[weekName][day.name].clients;
        }
      }
    });

    setData(updatedData);
  }, [appointmentsInfo]);

  return (
    <>
      {data && (
        <>
          <h1>Hello Dashboard</h1>
          <button onClick={signOut}>Logout</button>

          {/* TODO: Fazer esse botão flutuar */}
          <div>
            <button onClick={() => setDate(subMonths(date, 1))}>{'<'}</button>
            <h1>{format(date, 'MMMM')}</h1>
            <button onClick={() => setDate(addMonths(date, 1))}>{'>'}</button>
          </div>

          {/* TODO: resolver o seguinte erro: Received NaN for the `y1` attribute */}
          <LineChart
            width={730}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="week_1" stroke="#8884d8" />
            <Line type="monotone" dataKey="week_2" stroke="#82ca9d" />
            <Line type="monotone" dataKey="week_3" stroke="#82c8ca" />
            <Line type="monotone" dataKey="week_4" stroke="#82a1ca" />
            <Line type="monotone" dataKey="week_5" stroke="#ca82c6" />
            <Line type="monotone" dataKey="week_6" stroke="#ca828e" />
          </LineChart>
        </>
      )}
    </>
  );
}
