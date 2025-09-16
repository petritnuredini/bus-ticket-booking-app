import React, { useEffect, useState, useCallback } from "react";
import DailyBusForm from "../../components/DailyBusForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function AdminDailyBuses() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showDailyBusForm, setShowDailyBusForm] = useState(false);
  const [dailyBuses, setDailyBuses] = useState([]);
  const [selectedDailyBus, setSelectedDailyBus] = useState(null);

  const getDailyBuses = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/daily-buses/get-all-daily-buses", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setDailyBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteDailyBus = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/daily-buses/${id}`, {});

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getDailyBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const formatActiveDays = (activeDays) => {
    const dayNames = [
      t('common.sun'), 
      t('common.mon'), 
      t('common.tue'), 
      t('common.wed'), 
      t('common.thu'), 
      t('common.fri'), 
      t('common.sat')
    ];
    return activeDays.map(day => dayNames[day]).join(', ');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const columns = [
    {
      title: t('admin.busName'),
      dataIndex: "name",
      width: 150,
    },
    {
      title: t('booking.busNumber'),
      dataIndex: "busNumber",
      width: 120,
    },
    {
      title: t('admin.route'),
      width: 200,
      render: (_, record) => (
        <span>{record.from} → {record.to}</span>
      ),
    },
    {
      title: t('admin.defaultSchedule'),
      width: 180,
      render: (_, record) => (
        <div>
          <div>{t('booking.departureShort')}: {formatTime(record.defaultDeparture)}</div>
          <div>{t('booking.arrivalShort')}: {formatTime(record.defaultArrival)}</div>
        </div>
      ),
    },
    {
      title: t('admin.activeDays'),
      dataIndex: "activeDays",
      width: 200,
      render: (activeDays) => (
        <span className="text-sm">{formatActiveDays(activeDays)}</span>
      ),
    },
    {
      title: t('admin.capacity'),
      dataIndex: "capacity",
      width: 80,
    },
    {
      title: t('admin.price'),
      dataIndex: "price",
      width: 80,
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: t('admin.status'),
      dataIndex: "status",
      width: 100,
      render: (status) => {
        let colorClass = "text-green-500";
        if (status === "inactive") colorClass = "text-red-500";
        if (status === "suspended") colorClass = "text-yellow-500";
        
        return (
          <span className={`${colorClass} capitalize font-medium`}>
            {t(`admin.status_${status}`)}
          </span>
        );
      },
    },
    {
      title: t('admin.variations'),
      width: 100,
      render: (_, record) => {
        const variationCount = Object.keys(record.scheduleVariations || {}).length;
        return variationCount > 0 ? (
          <span className="text-blue-600 text-sm">
            {variationCount} {variationCount !== 1 ? t('admin.days') : t('admin.day')}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">{t('admin.none')}</span>
        );
      },
    },
    {
      title: t('admin.actions'),
      width: 100,
      render: (_, record) => (
        <div className="flex gap-3">
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl hover:text-red-700"
            onClick={() => deleteDailyBus(record.id)}
            title={t('admin.deleteDailyBus')}
          ></i>
          <i
            className="ri-pencil-line cursor-pointer text-blue-500 text-xl hover:text-blue-700"
            onClick={() => {
              setSelectedDailyBus(record);
              setShowDailyBusForm(true);
            }}
            title={t('admin.editDailyBus')}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getDailyBuses();
  }, [getDailyBuses]);

  return (
    <>
      <Helmet>
        <title>{t('admin.dailyBuses')}</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center p-7">
          <PageTitle title={t('admin.dailyBusSchedules')} />
          <button
            type="button"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
            onClick={() => setShowDailyBusForm(true)}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              {t('admin.addDailyBus')}
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>

        <div className="p-7">
          <div className="mb-4 text-sm text-gray-600">
            {t('admin.dailyBusManagementDescription')}
          </div>
          
          <Table
            columns={columns}
            dataSource={dailyBuses}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                t('admin.paginationTotal', {start: range[0], end: range[1], total: total})
            }}
            scroll={{ x: 1200 }}
            rowKey="id"
          />
          
          {showDailyBusForm && (
            <DailyBusForm
              showDailyBusForm={showDailyBusForm}
              setShowDailyBusForm={setShowDailyBusForm}
              type={selectedDailyBus ? "edit" : "add"}
              selectedDailyBus={selectedDailyBus}
              setSelectedDailyBus={setSelectedDailyBus}
              getData={getDailyBuses}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDailyBuses;
