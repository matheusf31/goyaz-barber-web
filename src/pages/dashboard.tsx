import { useCallback, useEffect, useMemo, useState } from 'react';
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
  BarChart,
  Bar,
} from 'recharts';
import { ptBR } from 'date-fns/locale';
import { addMonths, format, subMonths } from 'date-fns';

import { useAuth } from '../hooks/auth';
import api from '../services/api';

import Barbeiros from '../components/pages/dashboard/Barbeiros';

import { IAppointmentExtraDailyInfo } from '../dtos/_IAppointmentsDailyInfo';

import {
  Container,
  Header,
  LogoutButton,
  GraphsContainer,
  ClientGraphsContainer,
  PieChartContainer,
  ProfitByWeekGraphsContainer,
} from '../styles/pages/Dashboard';

interface IBarbeiro {
  id: string;
  name: string;
  avatar_url: string;
}

export type IBarbeiros = Array<IBarbeiro>;

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
  const { signOut, user: loggedUser } = useAuth();

  const [showGraphs, setShowGraphs] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [selectedBarbeiro, setSelectedBarbeiro] = useState<IBarbeiro>(loggedUser);

  const [barbeiros, setBarbeiros] = useState([] as IBarbeiros);

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
  const [monthProfitByWeek, setMonthProfitByWeek] = useState([
    {
      name: 'Week 1',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
    {
      name: 'Week 2',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
    {
      name: 'Week 3',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
    {
      name: 'Week 4',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
    {
      name: 'Week 5',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
    {
      name: 'Week 6',
      'profit without additionals': 0,
      'profit with additionals': 0,
    },
  ]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalProfitWithAdditional, setTotalProfitWithAdditional] = useState(0);
  const [totalProfitWithoutAdditional, setTotalProfitWithoutAdditional] = useState(0);

  const monthName = useMemo(() => {
    return format(date, 'MMMM', { locale: ptBR });
  }, [date]);

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

    if (selectedBarbeiro) {
      api
        .get(`appointments/daily/info/${selectedBarbeiro.id}`, {
          params: {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
        })
        .then((response) => setAppointmentsInfo(response.data));

      setShowGraphs(true);
    }
  }, [selectedBarbeiro, date]);

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
    let totalClientsInMonth = 0;

    updatedData.forEach((day) => {
      for (let index = 1; index <= 6; index++) {
        const weekName = `week ${index}`;

        if (appointmentsInfo && appointmentsInfo[weekName]) {
          day[weekName] = appointmentsInfo[weekName][day.name].clients;
          totalClientsInMonth += appointmentsInfo[weekName][day.name].clients;
        }
      }
    });

    setData(updatedData);
    setTotalClients(totalClientsInMonth);
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

    updatedData.forEach((week) => {
      if (appointmentsInfo && appointmentsInfo[week.name]) {
        week.value = appointmentsInfo[week.name].totalClientsInWeek;
      }
    });

    setTotalClientsByWeekInfo(updatedData);
  }, [appointmentsInfo]);

  useEffect(() => {
    const updatedData = [
      {
        name: 'week 1',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
      {
        name: 'week 2',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
      {
        name: 'week 3',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
      {
        name: 'week 4',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
      {
        name: 'week 5',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
      {
        name: 'week 6',
        'profit without additionals': 0,
        'profit with additionals': 0,
      },
    ];

    let totalProfitWithAdditionalInMonth = 0;
    let totalProfitWithoutAdditionalInMonth = 0;

    updatedData.forEach((week) => {
      if (appointmentsInfo && appointmentsInfo[week.name]) {
        week['profit with additionals'] = appointmentsInfo[week.name].profitWithAdditionals;
        totalProfitWithAdditionalInMonth += appointmentsInfo[week.name].profitWithAdditionals;
        week['profit without additionals'] = appointmentsInfo[week.name].profitWithoutAdditionals;
        totalProfitWithoutAdditionalInMonth += appointmentsInfo[week.name].profitWithoutAdditionals;
      }
    });

    setMonthProfitByWeek(updatedData);
    setTotalProfitWithAdditional(totalProfitWithAdditionalInMonth);
    setTotalProfitWithoutAdditional(totalProfitWithoutAdditionalInMonth);
  }, [appointmentsInfo]);

  useEffect(() => {
    if (loggedUser) {
      api.get(`/providers`).then((response) => {
        if (response.data) {
          setBarbeiros([...response.data, loggedUser]);
          setSelectedBarbeiro(loggedUser);
        }
      });
    }
  }, [loggedUser]);

  return (
    <Container>
      <LogoutButton onClick={signOut}>Logout</LogoutButton>

      <Barbeiros
        barbeiros={barbeiros}
        selectedBarbeiro={selectedBarbeiro}
        setSelectedBarbeiro={setSelectedBarbeiro}
      />

      {windowSize.width >= 600 && (
        <Header>
          <div>
            <button onClick={() => setDate(subMonths(date, 1))}>{'<'}</button>
            <h1>
              {monthName} - {format(date, 'yyyy')}
            </h1>
            <button onClick={() => setDate(addMonths(date, 1))}>{'>'}</button>
          </div>
        </Header>
      )}

      {showGraphs && (
        <GraphsContainer>
          <h3>Número de clientes de {monthName}</h3>

          <ClientGraphsContainer>
            <LineChart
              width={windowSize.width <= 800 ? windowSize.width / 1.2 : 700}
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

            <PieChartContainer>
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

              <span>
                <b>Total:</b> {totalClients}
              </span>
            </PieChartContainer>
          </ClientGraphsContainer>

          <h3>Lucro de {monthName} por semana</h3>

          <ProfitByWeekGraphsContainer>
            <BarChart
              width={500}
              height={300}
              data={monthProfitByWeek}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis padding={{ top: 30 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit with additionals" fill="#000" label={{ position: 'top' }}>
                {monthProfitByWeek.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                ))}
              </Bar>
            </BarChart>

            <span>
              <b>Total:</b> R$ {totalProfitWithAdditional}
            </span>

            <BarChart
              width={500}
              height={300}
              data={monthProfitByWeek}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis padding={{ top: 30 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit without additionals" fill="#000" label={{ position: 'top' }}>
                {monthProfitByWeek.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                ))}
              </Bar>
            </BarChart>

            <span>
              <b>Total:</b> R$ {totalProfitWithoutAdditional}
            </span>
          </ProfitByWeekGraphsContainer>
        </GraphsContainer>
      )}

      {windowSize.width < 600 && (
        <Header>
          <div>
            <button onClick={() => setDate(subMonths(date, 1))}>{'<'}</button>
            <h1>{format(date, 'MMMM - yyyy', { locale: ptBR })}</h1>
            <button onClick={() => setDate(addMonths(date, 1))}>{'>'}</button>
          </div>
        </Header>
      )}
    </Container>
  );
}
