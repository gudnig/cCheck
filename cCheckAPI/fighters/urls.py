from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken import views as auth_views
from fighters import views
from django.conf.urls import include

urlpatterns = [
	url(r'^fighters/$', views.FighterList.as_view()),
	url(r'^fighters/(?P<pk>[0-9]+)/$', views.FighterDetail.as_view()),
	url(r'^users/$', views.UserList.as_view()),
	url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
	url(r'^users/generatetokens/$', views.GenerateTokens.as_view()),
	url(r'^sessions/$', views.SessionList.as_view()),
	url(r'^sessions/(?P<pk>[0-9]+)/$', views.SessionDetail.as_view()),
]


urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += [
    url(r'^api-token-auth/', auth_views.obtain_auth_token)
]