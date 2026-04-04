import { Clock } from 'lucide-react';

interface TimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  showLabel?: boolean;
}

// Generate 96 time options (15-minute intervals)
const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      times.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }
  
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

export function TimeDropdown({ 
  value, 
  onChange, 
  placeholder = 'Select time',
  required = false,
  label,
  showLabel = true
}: TimeDropdownProps) {
  return (
    <div className="relative group">
      {showLabel && label && (
        <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          {label} {required && <span className="text-[#D4AF37]">*</span>}
        </label>
      )}
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)] appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
          }}
        >
          <option value="" disabled className="bg-[#1A1A1A] text-gray-400">
            {placeholder}
          </option>
          {TIME_OPTIONS.map((time) => (
            <option key={time} value={time} className="bg-[#1A1A1A] text-white">
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
