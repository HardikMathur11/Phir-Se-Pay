import React from 'react';

export interface TimelineStage {
  stage: 'DETECT' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'VERIFY';
  label: string;
  timestamp: string | null;
  actor: 'system' | 'ai' | 'human';
  actorLabel: string;
  completed: boolean;
}

interface TimelineDotsProps {
  stages: TimelineStage[];
}

export const TimelineDots: React.FC<TimelineDotsProps> = ({ stages }) => {
  const getActorColor = (actor: 'system' | 'ai' | 'human', completed: boolean) => {
    if (!completed) return { dot: 'var(--color-border)', text: 'var(--color-ink-tertiary)' };
    switch (actor) {
      case 'ai':
        return { dot: 'var(--color-escalated)', text: 'var(--color-escalated)' };
      case 'human':
        return { dot: 'var(--color-pending)', text: 'var(--color-pending)' };
      case 'system':
      default:
        return { dot: 'var(--color-ink)', text: 'var(--color-ink)' };
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {stages.map((st, idx) => {
          const colors = getActorColor(st.actor, st.completed);
          const isLast = idx === stages.length - 1;

          return (
            <div key={st.stage} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line */}
              {!isLast && (
                <div
                  className="absolute top-2.5 left-1/2 w-full h-[1px]"
                  style={{
                    backgroundColor: stages[idx + 1].completed
                      ? 'var(--color-ink)'
                      : 'var(--color-border)',
                  }}
                />
              )}

              {/* Dot */}
              <div
                className="w-5 h-5 rounded-full z-10 flex items-center justify-center border-2"
                style={{
                  borderColor: colors.dot,
                  backgroundColor: st.completed ? colors.dot : 'var(--color-surface)',
                }}
              >
                {st.completed && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface)]" />}
              </div>

              {/* Stage Name */}
              <span
                className="text-[11px] font-semibold uppercase tracking-wider font-ui mt-2 text-center"
                style={{ color: colors.text }}
              >
                {st.stage}
              </span>

              {/* Description & Actor */}
              <span className="text-[10px] text-[var(--color-ink-secondary)] font-ui text-center mt-0.5">
                {st.label}
              </span>

              {/* Timestamp */}
              <span className="text-[9px] font-data text-[var(--color-ink-tertiary)] mt-1">
                {st.timestamp
                  ? new Date(st.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
