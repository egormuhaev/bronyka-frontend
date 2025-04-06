import { useApi } from '@/app/shared/api/useApi';
import { BigCalendarReservations } from '@/app/shared/BigCalendarReservations';
import { RESERVATIONS_API } from '@/app/shared/constants';
import {
  dateTimeFormatter,
  reservationForBigCalendarDTO,
  userConfirmAction,
} from '@/app/shared/utils';
import { Reservation } from '@/features/meeting_rooms/types';
import { Button, FloatButton, List, Switch } from 'antd';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { mutate } from 'swr';
import { useOwnReservations } from '../hooks/useOwnReservations';
FloatButton;

interface HistoryToggleProps {
  history: boolean;
  onHistoryChange: (checked: boolean) => void;
  view: boolean;
  onViewChange: (checked: boolean) => void;
}

const df = dateTimeFormatter;

export function OwnReservationsList() {
  const [history, setHistory] = useState<boolean>(false);
  const [viewCalendar, setViewCalendar] = useState<boolean>(false);

  const reservations = useOwnReservations(history);

  return (
    <div className="h-auto w-full overflow-y-auto">
      <ListHeader
        view={viewCalendar}
        onViewChange={setViewCalendar}
        history={history}
        onHistoryChange={setHistory}
      />
      <div className="w-full h-full">
        {viewCalendar ? (
          <BigCalendarReservations
            events={reservationForBigCalendarDTO(reservations)}
          />
        ) : (
          <List
            className="w-full bg-white"
            bordered
            dataSource={reservations}
            renderItem={history ? ListItemWithoutControls : ListItem}
          />
        )}
      </div>
    </div>
  );
}

function ListItemWithoutControls({
  from_reserve,
  to_reserve,
  meetingroom,
}: Reservation) {
  const datetime = `${df(from_reserve)} - ${df(to_reserve)}`;

  return (
    <List.Item>
      <div
        className="w-full flex flex-row justify-between items-center"
        style={{ padding: 10 }}
      >
        <div className="grid grid-rows-2">
          <p className="font-semibold">
            <span className="font-extrabold">Рабочее место:</span>{' '}
            {meetingroom.name}
          </p>
          <p className="font-semibold">
            <span className="font-extrabold">Дата:</span> {datetime}
          </p>
        </div>
      </div>
    </List.Item>
  );
}

function ListItem({ from_reserve, to_reserve, meetingroom, id }: Reservation) {
  const datetime = `${df(from_reserve)} - ${df(to_reserve)}`;
  const api = useApi();

  return (
    <List.Item>
      <div
        className="w-full flex flex-row justify-between items-center"
        style={{ padding: 10 }}
      >
        <div className="grid grid-rows-2">
          <p className="font-semibold">
            <span className="font-extrabold">Рабочее место:</span>{' '}
            {meetingroom.name}
          </p>
          <p className="font-semibold">
            <span className="font-extrabold">Дата:</span> {datetime}
          </p>
        </div>
        <Button
          color="red"
          variant="solid"
          icon={<MdDelete />}
          shape="circle"
          onClick={handleDeleteReservation}
        />
      </div>
    </List.Item>
  );

  async function handleDeleteReservation() {
    try {
      const confirm = userConfirmAction(`Удалить заявку на бронирование`);
      if (!confirm) return;
      await api.delete(`${RESERVATIONS_API}/${id}`);
    } catch (e) {
      console.log(e);
    } finally {
      await mutate(() => true, undefined, { revalidate: true });
    }
  }
}

function ListHeader({
  history,
  onHistoryChange,
  view,
  onViewChange,
}: HistoryToggleProps) {
  return (
    <div className="flex items-center gap-5" style={{ padding: 10 }}>
      <span className="font-semibold text-black">
        Мои заявки на бронирование
      </span>
      <Switch checked={history} onChange={onHistoryChange} />
      <span className={`font-bold ${history ? 'text-blue-500' : 'text-black'}`}>
        История
      </span>

      <Switch checked={view} onChange={onViewChange} />
      <span className={`font-bold ${view ? 'text-blue-500' : 'text-black'}`}>
        Календарь
      </span>
    </div>
  );
}
