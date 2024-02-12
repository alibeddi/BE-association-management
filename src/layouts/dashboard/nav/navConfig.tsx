import { MethodCode, ModelCode } from '../../../@types/Permission';
import { AuthUserType } from '../../../auth/types';
import SvgColor from '../../../components/svg-color';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { hasPermission } from '../../../sections/@dashboard/Permissions/utils';
import {
  ic_operators,
  ic_settings,
  ic_lock,
  ic_calendar,
  ic_call,
} from '../../../assets/icons/navbar';

const icon = (iconSrc: string) => <SvgColor src={iconSrc} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  operators: icon(ic_operators),
  settings: icon(ic_settings),
  groupPermissions: icon(ic_lock),
  calendar: icon(ic_calendar),
  calls: icon(ic_call),
};

export default function navConfig(user: AuthUserType) {
  const userPermissions = user?.permissionGroup[0].permissions;
  const hasAccessToKpis = hasPermission(userPermissions, ModelCode.KPI, MethodCode.LIST);
  const hasAccessToUsers = hasPermission(userPermissions, ModelCode.USER, MethodCode.LIST);
  const hasAccessToGroupPermissions = hasPermission(
    userPermissions,
    ModelCode.PERMISSION_GROUP,
    MethodCode.LIST
  );
  const hasAccessToCalendar = hasPermission(userPermissions, ModelCode.WORKTIME, MethodCode.LIST);
  const hasAccessToCalls = hasPermission(userPermissions, ModelCode.CALLS, MethodCode.LIST);
  const config = [
    {
      subheader: '',
      items: [
        {
          title: 'operators',
          path: PATH_DASHBOARD.operators,
          icon: ICONS.operators,
          toBeDisplayed: hasAccessToUsers,
        },
        {
          title: 'kpis',
          path: PATH_DASHBOARD.kpis.root,
          icon: ICONS.settings,
          toBeDisplayed: hasAccessToKpis,
        },
        {
          title: 'group permissions',
          path: PATH_DASHBOARD.groupPermissions,
          icon: ICONS.groupPermissions,
          toBeDisplayed: hasAccessToGroupPermissions,
        },
        {
          title: 'calendar',
          path: PATH_DASHBOARD.calender,
          icon: ICONS.calendar,
          toBeDisplayed: hasAccessToCalendar,
        },
        {
          title: 'calls',
          path: PATH_DASHBOARD.calls,
          icon: ICONS.calls,
          toBeDisplayed: hasAccessToCalls,
        },
      ],
    },
  ];

  return config;
}
