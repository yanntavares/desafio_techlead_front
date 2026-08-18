'use client'

export function WeeklyCalendar() {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const businessHours = Array.from({ length: 15 }, (_, i) => i + 6); 

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      
      <div className="grid grid-cols-8 border-b border-border/30 bg-[#F7F9FB]">
        <div className="py-3 px-2 text-center text-sm font-semibold text-normal">
          Hora
        </div>
        {daysOfWeek.map((day) => (
          <div key={day} className="py-3 text-center border-l border-gray-200 text-sm font-semibold text-[#191C1E]">
            {day}
          </div>
        ))}
      </div>

      <div className="overflow-y-auto max-h-[600px] bg-white">
        {businessHours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
            
            <div className="py-4 text-center text-sm text-black font-medium">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>

            {daysOfWeek.map((day) => {
              // ADICIONAR LÓGICA QUANDO CONSUMIR A API
              const isAvailable = true; 

              return (
                <div 
                  key={`${day}-${hour}`} 
                  className="border-l border-gray-100 p-1 flex items-center justify-center cursor-pointer"
                >
                  <div className={`w-full h-full min-h-[40px] rounded-md transition-all flex items-center justify-center ${
                    isAvailable 
                      ? 'bg-[#78FF88]/20 hover:bg-[#78FF88]/60 border border-transparent' 
                      : 'bg-[#FFDAD6] cursor-not-allowed'
                  }`}>
                    <p className={`font-medium ${isAvailable ? 'text-[#007F35]' : 'text-[#93000A]'}`}>
                        {isAvailable ? 'Livre' : 'Reservado'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
    </div>
  );
}