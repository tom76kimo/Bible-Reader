(function(){
    'use strict';
    var config = {
        HTTP_CONNECT_METHOD:   'get',
        USER_AJAX_URL:         '/photo/p/api/user.php',
        LIST_AJAX_URL:         '/photo/p/api/list.php',
        THUMB_AJAX_URL:        '/photo/p/api/thumb.php',
        PHOTO_AJAX_URL:        '/photo/p/api/photo.php',
        VIDEO_AJAX_URL:        '/photo/p/api/video.php',
        ALBUM_AJAX_URL:        '/photo/p/api/album.php',
        HISTORY_AJAX_URL:      '/photo/p/api/history.php',
        UTIL_AJAX_URL:         '/photo/p/api/utility.php',
        QSOCIAL_AJAX_URL:      '/photo/p/api/qsocial.php',
        UPLOAD_AJAX_URL:       '/photo/p/api/upload.php'
    };  
    
    var PSPublicAPI;
    
    
    PSPublicAPI = this.PSPublicAPI = {
        List: {
		    ajaxURL: config.LIST_AJAX_URL,
			
			/** Get photos/videos that should be displayed on QTS photo wall */
            getWallMedia: function(options, callback){
                var jData = options || {};
                jData.t = 'wall';
                PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
            },
			
			/** Get the list of users that have public shared their albums */
			getPublicUsers: function(callback){
			    var jData = {t: 'users'};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			
			/** Get all public albums */
			getAllAlbums: function(callback){
			    var jData = {t: 'albums'};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			
			/** Get a particular user’s public albums */
			getUserAlbums: function(userId, callback){
			    if(userId === undefined)
				    return false;
				var jData = {u: userId, t: 'userAlbums'};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			
			/** Get filtered media from a album */
			getAlbumItems: function(albumId, options, callback){
			    if(albumId === undefined)
				    return false;
			    var jData = options || {};
				jData.t = 'allMedia';
				jData.a = albumId;
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			
			/** Get timeline of video and photo */
			getTimeline: function(albumId, options, callback){
			    if(albumId === undefined)
				    return false;
				var jData = options || {};
				jData.t = 'timeline';
				jData.a = albumId;
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			
			/** Get photo timeline */
			getPhotoTimeline: function(albumId, options, callback){
			    if(albumId === undefined)
				    return false;
				var jData = options || {};
				jData.t = 'timeline-p';
				jData.a = albumId;
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);			
			},
			
			/** Get video timeline */
			getVideoTimeline: function(albumId, options, callback){
			    if(albumId === undefined)
				    return false;
				var jData = options || {};
				jData.t = 'timeline-v';
				jData.a = albumId;
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);			
			}			
        },
		Photo: {
		    ajaxURL: config.PHOTO_AJAX_URL,
			/** Get the photo */
			download: function(mediaId, ac, callback){
			    if(mediaId === undefined || ac === undefined)
				    return false;
				var jData = {a: 'download', f: mediaId, ac: ac};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			}
		},
		Video: {
		    ajaxURL: config.VIDEO_AJAX_URL,
			/** Get the video */
			download: function(mediaId, ac, callback){
			    if(mediaId === undefined || ac === undefined)
				    return false;
				var jData = {a: 'download', f: mediaId, ac: ac};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			}
		},
        Thumb: {
		    ajaxURL: config.THUMB_AJAX_URL,
			getThumbImage: function(mediaId, ac, options, callback){
			    if(mediaId === undefined || ac === undefined)
				    return false;
				var jData = options || {};
			}
		},
        Album: {
		    
		},		
        Util: {
		    ajaxURL: config.UTIL_AJAX_URL,
            ajaxConnect: function(ajaxURL, data, callback, opt_httpType){
                var xmlString = null;
                opt_httpType = opt_httpType || config.HTTP_CONNECT_METHOD;
				var jData = _.clone(data);
				jData.success = undefined;
				jData.error = undefined;
                
                (function(){
                    $.ajax({
                        type: opt_httpType,
                        url:  ajaxURL,
                        data: jData,
                        dataType: 'html',
                        async:  true
                    })
                    .done(function(data, textStatus, jqXHR){
                        callback && callback.success && callback.success(data, textStatus, jqXHR);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown){
                        callback && callback.error && callback.error(jqXHR, textStatus, errorThrown);
                    });                 
                })();
                
            },
			handleXmlString: function(xmlString){
			    if(xmlString === undefined || xmlString == false)
				    return false;
			    var xmlDoc = $.parseXML(xmlString);
				var $xml   = $(xmlDoc);
				return $xml;
			},			
            getAccessList: function(callback){
				var jData = {a: 'getAccessList'};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);
			},
			getLastUpdate: function(callback){
				var jData = {a: 'lastUpdate'};
				PSPublicAPI.Util.ajaxConnect(this.ajaxURL, jData, callback);			
			}
        }
    };
    
}).call(this);