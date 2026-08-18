import { Reservation, ReservationStatus } from '@/app/api/api';

export type SlotStatus = 'free' | 'reserved';
export type TimeSlot = { time: string; status: SlotStatus };
export type DaySchedule = { day: string; slots: TimeSlot[] };

const SLOT_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS_AHEAD = 5;

export function buildSchedule(reservations: Reservation[]): {
  schedule: DaySchedule[];
  dateByDay: Record<string, Date>;
} {
  const now = new Date();
  const dateByDay: Record<string, Date> = {};
  const schedule: DaySchedule[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const rawLabel = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
    dateByDay[label] = date;

    const slots: TimeSlot[] = SLOT_HOURS.map((hour) => {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const blocked =
        slotStart <= now ||
        reservations.some(
          (r) =>
            r.status === ReservationStatus.SCHEDULED &&
            slotStart >= new Date(r.startDateTime) &&
            slotStart < new Date(r.endDateTime),
        );
      return { time: `${hour}:00`, status: blocked ? 'reserved' : 'free' };
    });

    schedule.push({ day: label, slots });
  }

  return { schedule, dateByDay };
}

type AvailabilityGridProps = {
  schedule: DaySchedule[];
  selectedDay?: string | null;
  selectedTime?: string | null;
  onSelectSlot?: (day: string, time: string) => void;
};

export function AvailabilityGrid({ schedule, selectedDay, selectedTime, onSelectSlot }: AvailabilityGridProps) {
  return (
    <div className="overflow-x-auto h-64">
      <div className="min-w-[420px]">
        <div className="grid grid-cols-6 border-b border-border/30">
          <div className="py-2" />
          {schedule.map(({ day }) => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-[#191C1E]">
              {day}
            </div>
          ))}
        </div>

        {schedule[0]?.slots.map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 border-b border-gray-100 last:border-0">
            <div className="py-2 pr-2 flex items-center justify-end text-sm text-black font-medium">
              {schedule[0].slots[rowIndex].time}
            </div>
            {schedule.map(({ day, slots }) => {
              const slot = slots[rowIndex];
              const isSelected = selectedDay === day && selectedTime === slot.time;
              const isFree = slot.status === 'free';
              const cellClassName = `w-full min-h-[36px] rounded-md text-xs font-semibold transition flex items-center justify-center ${
                isSelected
                  ? 'bg-darkest-blue text-white'
                  : isFree
                    ? 'bg-[#78FF88]/20 text-[#007F35] hover:bg-[#78FF88]/60'
                    : 'bg-[#FFDAD6] text-[#93000A] cursor-not-allowed'
              }`;
              const label = isSelected ? slot.time : isFree ? 'Free' : 'Rsv';

              return (
                <div key={`${day}-${slot.time}`} className="p-1 flex items-center justify-center">
                  {onSelectSlot ? (
                    <button type="button" disabled={!isFree} onClick={() => onSelectSlot(day, slot.time)} className={cellClassName}>
                      {label}
                    </button>
                  ) : (
                    <div className={cellClassName}>{label}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
