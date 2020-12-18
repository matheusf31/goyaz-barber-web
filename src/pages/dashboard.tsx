import { useCallback, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell,
  PieLabelRenderProps,
} from 'recharts';
import { ptBR } from 'date-fns/locale';
import { addMonths, format, subMonths } from 'date-fns';

import { useAuth } from '../hooks/auth';
import api from '../services/api';
import { IAppointmentExtraDailyInfo } from '../dtos/_IAppointmentsDailyInfo';

import {
  Container,
  Header,
  LogoutButton,
  ClientNumberContainer,
  ClientGraphsContainer,
} from '../styles/pages/Dashboard';

interface IRenderActiveShape {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    name: string;
    value: number;
  };
  value: number;
}

type IData = Array<
  {
    name: string;
    'week 1': number;
    'week 2': number;
    'week 3': number;
    'week 4': number;
    'week 5': number;
    'week 6': number;
  } & {
    [key: string]: number;
  }
>;

const COLORS = ['#5d13a3', '#13a326', '#13a3a3', '#a34113', '#a3138b', '#a31313'];

const renderActiveShape = (props: IRenderActiveShape): JSX.Element => {
  const RADIAN = Math.PI / 180;

  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />

      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Clientes: ${value}`}</text>
    </g>
  );
};

const renderCustomizedLabel = ({
  value,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
}: PieLabelRenderProps): JSX.Element => {
  const RADIAN = Math.PI / 180;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.3;

  let x = 0,
    y = 0;

  if (midAngle) {
    x = Number(cx) + Number(radius) * Math.cos(-midAngle * RADIAN);
    y = Number(cy) + Number(radius) * Math.sin(-midAngle * RADIAN);
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > Number(cx) ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {value || null}
    </text>
  );
};

export default function Dashboard(): JSX.Element {
  const { signOut, user } = useAuth();

  const [showGraphs, setShowGraphs] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [appointmentsInfo, setAppointmentsInfo] = useState<IAppointmentExtraDailyInfo>();
  const [data, setData] = useState<IData>([]);
  const [date, setDate] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalClientsByWeekInfo, setTotalClientsByWeekInfo] = useState([
    {
      name: 'week_1',
      value: 0,
    },
    {
      name: 'week_2',
      value: 0,
    },
    {
      name: 'week_3',
      value: 0,
    },
    {
      name: 'week_4',
      value: 0,
    },
    {
      name: 'week_5',
      value: 0,
    },
    {
      name: 'week_6',
      value: 0,
    },
  ]);

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize]);

  useEffect(() => {
    setShowGraphs(false);

    if (user) {
      api
        .get(`appointments/daily/info/${user.id}`, {
          params: {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
        })
        .then((response) => setAppointmentsInfo(response.data));

      setShowGraphs(true);
    }
  }, [user, date]);

  useEffect(() => {
    const updatedData = [
      {
        name: 'monday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
      {
        name: 'tuesday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
      {
        name: 'wednesday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
      {
        name: 'thursday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
      {
        name: 'friday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
      {
        name: 'saturday',
        'week 1': 0,
        'week 2': 0,
        'week 3': 0,
        'week 4': 0,
        'week 5': 0,
        'week 6': 0,
      },
    ] as IData;

    updatedData.forEach((day) => {
      for (let index = 1; index <= 6; index++) {
        const weekName = `week ${index}`;

        if (appointmentsInfo && appointmentsInfo[weekName]) {
          day[weekName] = appointmentsInfo[weekName][day.name].clients;
        }
      }
    });

    setData(updatedData);
  }, [appointmentsInfo]);

  useEffect(() => {
    const updatedData = [
      {
        name: 'week 1',
        value: 0,
      },
      {
        name: 'week 2',
        value: 0,
      },
      {
        name: 'week 3',
        value: 0,
      },
      {
        name: 'week 4',
        value: 0,
      },
      {
        name: 'week 5',
        value: 0,
      },
      {
        name: 'week 6',
        value: 0,
      },
    ];

    updatedData.forEach((day) => {
      if (appointmentsInfo && appointmentsInfo[day.name]) {
        day.value = appointmentsInfo[day.name].totalClientsInWeek;
      }
    });

    setTotalClientsByWeekInfo(updatedData);
  }, [appointmentsInfo]);

  return (
    <Container>
      <Header>
        <div>
          <button onClick={() => setDate(subMonths(date, 1))}>{'<'}</button>
          <h1>{format(date, 'MMMM - yyyy', { locale: ptBR })}</h1>
          <button onClick={() => setDate(addMonths(date, 1))}>{'>'}</button>
        </div>

        <LogoutButton onClick={signOut}>Logout</LogoutButton>
      </Header>

      {showGraphs && (
        <ClientNumberContainer>
          <h4>Número de clientes</h4>

          <ClientGraphsContainer>
            <LineChart
              width={windowSize.width <= 800 ? windowSize.width / 1.1 : 700}
              height={400}
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="bottom" />
              <Line type="linear" dataKey="week 1" stroke="#5d13a3" />
              <Line type="linear" dataKey="week 2" stroke="#13a326" />
              <Line type="linear" dataKey="week 3" stroke="#13a3a3" />
              <Line type="linear" dataKey="week 4" stroke="#a34113" />
              <Line type="linear" dataKey="week 5" stroke="#a3138b" />
              <Line type="linear" dataKey="week 6" stroke="#a31313" />
            </LineChart>

            <PieChart width={500} height={300}>
              <Pie
                activeIndex={activeIndex}
                labelLine={false}
                label={(props) => renderCustomizedLabel(props)}
                activeShape={renderActiveShape}
                data={totalClientsByWeekInfo}
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {totalClientsByWeekInfo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ClientGraphsContainer>
        </ClientNumberContainer>
      )}
    </Container>
  );
}
