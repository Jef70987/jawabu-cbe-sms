from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'students', views.StudentViewSet)
router.register(r'discipline-cases', views.DisciplineCaseViewSet)
router.register(r'suspensions', views.SuspensionViewSet)
router.register(r'counseling-sessions', views.CounselingSessionViewSet)
router.register(r'intervention-programs', views.InterventionProgramViewSet)
router.register(r'intervention-plans', views.InterventionPlanViewSet)
router.register(r'report-templates', views.ReportTemplateViewSet)
router.register(r'generated-reports', views.GeneratedReportViewSet)
router.register(r'scheduled-reports', views.ScheduledReportViewSet)
router.register(r'calendar-events', views.CalendarEventViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'settings', views.UserSettingsViewSet, basename='usersettings')
router.register(r'statistics', views.StatisticsViewSet, basename='statistics')

urlpatterns = [
    path('', include(router.urls)),
]