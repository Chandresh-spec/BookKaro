'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Ticket,
  Percent,
  AlertCircle,
  CheckCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { AccountShell } from '@/components/profile/AccountShell';
import { ToastAlert, EmptyStateBlock } from '@/components/profile/AccountUi';
import { useAccount } from '@/context/AccountContext';
import { NotificationCategory } from '@/types/account';

export default function NotificationsPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    resetDemoState,
  } = useAccount();

  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const groups: ('Today' | 'Earlier this week' | 'Earlier')[] = [
    'Today',
    'Earlier this week',
    'Earlier',
  ];

  const tabs: { id: NotificationCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'offers', label: 'Offers & Rewards' },
    { id: 'alerts', label: 'Account Alerts' },
  ];

  const getIcon = (cat: 'bookings' | 'offers' | 'alerts') => {
    switch (cat) {
      case 'bookings':
        return Ticket;
      case 'offers':
        return Percent;
      case 'alerts':
      default:
        return AlertCircle;
    }
  };

  return (
    <AccountShell
      activeSection="notifications"
      pageTitle="Notifications"
      mobileRightAction={
        unreadNotificationsCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              markAllNotificationsRead();
              showToast('All notifications marked as read');
            }}
            className="text-xs font-bold text-[#85142f] cursor-pointer"
          >
            Mark all read
          </button>
        ) : null
      }
    >
      <ToastAlert message={toast} />

      <div className="space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-neutral-900">Notifications</h2>
              {unreadNotificationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#85142f] text-white text-[10px] font-bold">
                  {unreadNotificationsCount} Unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsRead();
                    showToast('All notifications marked as read');
                  }}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#85142f] hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllNotifications();
                    showToast('Notifications cleared');
                  }}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-5 flex items-center gap-5 border-b border-neutral-100 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#85142f] text-[#85142f]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Stream */}
        {filtered.length === 0 ? (
          <EmptyStateBlock
            icon={Bell}
            title="You’re all caught up!"
            description={
              notifications.length === 0
                ? 'No notifications yet. Ticket alerts, showtime reminders, and reward drops will appear here.'
                : 'No notifications match this filter right now.'
            }
            actionLabel={notifications.length === 0 ? 'Restore Sample Alerts' : 'Show All Notifications'}
            onAction={() => {
              if (notifications.length === 0) {
                resetDemoState();
                showToast('Sample notifications restored');
              } else {
                setActiveTab('all');
              }
            }}
          />
        ) : (
          <div className="space-y-4">
            {groups.map((group) => {
              const items = filtered.filter((n) => n.dateGroup === group);
              if (items.length === 0) return null;

              return (
                <div
                  key={group}
                  className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-2xs"
                >
                  <div className="px-4 sm:px-5 py-2 bg-neutral-50/80 border-b border-neutral-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      {group}
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {items.map((item) => {
                      const Icon = getIcon(item.category);
                      return (
                        <div
                          key={item.id}
                          onClick={() => markNotificationRead(item.id)}
                          className={`p-4 sm:px-5 flex items-start gap-3.5 transition-colors cursor-pointer ${
                            !item.isRead
                              ? 'bg-rose-50/40 hover:bg-rose-50/60'
                              : 'bg-white hover:bg-neutral-50/80'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              !item.isRead
                                ? 'bg-[#85142f]/10 text-[#85142f]'
                                : 'bg-neutral-100 text-neutral-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-xs sm:text-[13px] leading-snug ${
                                  !item.isRead
                                    ? 'font-bold text-neutral-900'
                                    : 'font-semibold text-neutral-800'
                                }`}
                              >
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 shrink-0">
                                {!item.isRead && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-[#85142f]"
                                    aria-label="Unread"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(item.id);
                                    showToast('Notification removed');
                                  }}
                                  className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                              {item.message}
                            </p>

                            <div className="flex items-center justify-between gap-3 mt-2.5">
                              <span className="text-[11px] text-neutral-400 font-medium">
                                {item.timestamp}
                              </span>
                              {item.actionHref && item.actionLabel && (
                                <Link
                                  href={item.actionHref}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationRead(item.id);
                                  }}
                                  className="inline-flex items-center gap-0.5 text-xs font-bold text-[#85142f] hover:underline"
                                >
                                  <span>{item.actionLabel}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
