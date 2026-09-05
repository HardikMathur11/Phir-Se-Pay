import React, { useEffect, useState } from 'react';
import { Mail, ExternalLink, Clock, ChevronDown, ChevronUp, Sparkles, Inbox } from 'lucide-react';
import { api } from '../../api';
import { Notification } from '../../types';

interface CustomerInboxPageProps {
  onOpenRecoveryLink: (linkUrl: string) => void;
}

export const CustomerInboxPage: React.FC<CustomerInboxPageProps> = ({ onOpenRecoveryLink }) => {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInbox = async () => {
    try {
      const notifs = await api.getCustomerInbox('cust_amit_1');
      setMessages(notifs);
      if (notifs.length > 0 && !expandedId) {
        setExpandedId(notifs[0].id);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6 animate-fadeIn">
      <div className="ledger-panel p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] pb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] tracking-tight">
              Customer Inbox (Amit Sharma)
            </h1>
            <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-0.5">
              Simulated mailbox for amit@example.com receiving Phir Se Pay recovery reminders.
            </p>
          </div>
          <span className="font-data text-xs text-[var(--color-ink-secondary)] px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            {messages.length} messages
          </span>
        </div>

        {/* Flat List of Message Rows */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="py-20 text-center text-[var(--color-ink-secondary)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-tile)] border border-[var(--color-border)]">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-[var(--color-ink-tertiary)]" />
              <p className="text-xs font-ui">Inbox is currently empty.</p>
              <span className="text-[11px] text-[var(--color-ink-tertiary)] font-data block mt-1">
                Initiate a payment failure in Checkout to trigger a customer recovery email.
              </span>
            </div>
          ) : (
            messages.map((m) => {
              const isExpanded = expandedId === m.id;

              return (
                <div
                  key={m.id}
                  className="ledger-sunken rounded-[var(--radius-tile)] border border-[var(--color-border)] overflow-hidden transition-all"
                >
                  {/* Row Header */}
                  <div
                    onClick={() => toggleExpand(m.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Unread small filled dot */}
                      <span className="w-2 h-2 rounded-full bg-[var(--color-escalated)] shrink-0" />

                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-ui font-semibold text-xs text-[var(--color-ink)]">
                            Phir Se Pay Support
                          </span>
                          <span className="font-data text-[10px] text-[var(--color-ink-tertiary)]">
                            • {m.provider.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-ui font-medium text-xs text-[var(--color-ink-secondary)] mt-0.5">
                          {m.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-data text-[10px] text-[var(--color-ink-tertiary)]">
                        {m.sentAt
                          ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just now'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[var(--color-ink-secondary)]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--color-ink-secondary)]" />
                      )}
                    </div>
                  </div>

                  {/* Inline Message Body (No modal) */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-4 text-xs">
                      <div className="whitespace-pre-wrap font-ui text-[var(--color-ink)] leading-relaxed bg-[var(--color-surface-sunken)] p-4 rounded-[var(--radius-tile)] border border-[var(--color-border)] font-normal text-xs">
                        {m.body}
                      </div>

                      {/* Recovery link as the one visible action */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => onOpenRecoveryLink(m.recoveryLink)}
                          className="bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white font-semibold font-ui px-4 py-2 rounded-[var(--radius-pill)] text-xs flex items-center space-x-1.5 transition-colors"
                        >
                          <span>Open Recovery Payment Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
