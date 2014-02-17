(function(){
    'use strict';
    var Backbone = this.Backbone;
    var PSPublicAPI = this.PSPublicAPI;
    
    var PSPublic = this.PSPublic = function(){};
    
    PSPublic.prototype.getMedia = function(mediaId, albumId, options){
	    //mediaId here should be the uid
        var media = new Media();
		media.fetch({albumId: albumId, mediaId: mediaId, 
		     success: function(model){
			     options && options.success && options.success(model);
			 },
			 error: function(){
			     options && options.error && options.error();
			 }
		});
    };
    PSPublic.prototype.getAlbum = function(albumId, options){
	    var album = new Album();
		album.albumId = albumId;
		album.fetchInfo(options);
		//return album;
	};
	PSPublic.prototype.getUsers = function(options){
	    var users = [];
		PSPublicAPI.List.getAllAlbums({
		    success: function(xmlString){
			    var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
				$xml.find('userItem').each(function(key, value){
				    var user = new User();
					user.set({id: $(value).children('id').text(), name: $(value).children('owner').text()});
					var albumList = getAlbumsList($(value).find('albums'));
					user.albumList = albumList;
					users.push(user);
				});
				options && options.success && options.success(users);
				//console.log(users);
			},
			error: function(){
			    options && options.error && options.error();
			}
		});
		
        function getAlbumsList(albumsObj){
		    var albumList = [];
		    albumsObj.find('FileItem').each(function(key, value){
			    var nodeNames = [];
				var values = [];			
			    $(value).contents().each(function(key, value){
				    nodeNames.push(this.nodeName);
					values.push($(value).text());
				});
				var data = _.object(nodeNames, values);
                var album = new Album();
				album.albumId = data.iPhotoAlbumId;
				album.attrs = data;
				albumList.push(album);
			});
			return albumList;
		}
	};
    
    var User = Backbone.Model.extend({
        defaults:{
          id: undefined,
          name: undefined
        },
		albumList: []
    });

    // Media Model Definition
    // ---------------------    
    var Media = Backbone.Model.extend(
    /** @lends Media.prototype */
    {
        /** 
        * Initialize and define event 'change' and 'invalid' here.
        * @constructs
        */
        initialize: function(){
            this.api = PSPublicAPI;
            this.handleXmlString = this.api.Util.handleXmlString;

            /**
             * If there was any attributes illegal, this invalid event would be fired.
             * @event Media#invalid
             */
            this.on('invalid', function(model, error){
                console.log(error);
            });
            
        },

        /** 
         * Rewrite sync () code. When save(), save the legal attributes have been changed to back-end. 
         * Fetch the changed attributes from the record table record in change event.        
         * @function
         * @private
         * @param {string} method This should be one of restful methods: create, update, read, delete.
         * @param {model} model Indicate this model.
         * @param {object} options Includes callback function named success and error.       
         */         
        sync: function(method, model, options){
            
            //determine if all of the actions are success
            if(method === 'update'){   //save()
                

            }
            else if(method === 'read'){    //fetch()
                if(_.isUndefined(options.albumId) || _.isUndefined(options.mediaId)){
                    options && options.error && options.error();
                    return false;
                }
                PSPublicAPI.List.getAlbumItems(options.albumId, {}, {
                    success: function(xmlString){
						options && options.success && options.success(xmlString);
                    },
                    error: function(){}
                });
        
            }
            else if(method === 'create'){   //save()
                console.log('create');

            }
            else if(method === 'delete'){    //destroy()
                console.log('delete');
            }
            else{}
        },
        
        /**
         * Parse the data
         * @private
         * @param {xmlObject} res The object returned by PhotoStationAPI.handleXmlString.
         * @param {object} options The object passing by fetch(), save(), destroy().
         */         
        parse: function(res, options){
		    var $xml = PSPublicAPI.Util.handleXmlString(res);
			var self = this;
			var pList = [];
            var pValue = [];
			
			$xml.find('FileItem').each(function(key, value){
				if($(value).find('uid').text() === options.mediaId){
					$(value).contents().each(function(key, value){
						var nodeName = this.nodeName;
						//replace id to mediaId
						if(nodeName == 'id')
							nodeName = 'mediaId';
						pList.push(nodeName);
						pValue.push($(value).text());
					});
					return false;
				}
			});
			
            var data = _.object(pList, pValue);
            data.id = data.uid;
			//this.id = data.id;
            return data;
        },
        
         /**
         * Set fetched attributes to model
         * @private
         * @param {object} xmlObj The object returned by PhotoStationAPI.handleXmlString.
         */ 
        setInfo: function(xmlObj){
            var pList = [];
            var pValue = [];
            xmlObj.contents().each(function(key, value){
                var nodeName = this.nodeName;
                //replace id to mediaId
                if(nodeName == 'id')
                    nodeName = 'mediaId';
                pList.push(nodeName);
                pValue.push($(value).text());
            });
            
            var data = _.object(pList, pValue);
            data.id = data.uid;
			//console.log(data.cPictureTitle);
            this.set(data);
			//this.id = data.uid;

        },        
        /** 
         * Fetch all the attributes of this model from back-end.
         * @function fetch
         * @memberof Media#
         * @example
         * media.fetch({
         *     success: function(model, response, options){
         *         //do something
         *     },
         *     error: function(model, xhr, options){}   
         * });
         */
         
         
         /** 
         * Get the attributes of this model.
         * @function get
         * @param {string} attrName The name of target attribute.
         * @memberof Media#
         * @example
         * var type = media.get('MediaType');
         */      
         
        /**
         * Defined validate formula here. If the function return anything, it'll fire invalid event.
         * @private
         * @param {object} attrs The object of attributes.
         * @param {object} options 
         */
        validate: function(attrs, options){
            if(attrs.rating < 0 || attrs.rating > 100)
                return 'Rating set out of bound.';          
        },

        /**
         * Return the media's download url.
         * @param {string} size (default, 1, 2), omit this variable for default size , *video does not have size option
         * @return {string} Return the download url. 
         */     
        getDownloadUrl: function(){
		    var cgiUrl;
		    if(this.get('MediaType') === 'photo')
                cgiUrl = '/photo/p/api/photo.php?ac=' + this.get('code') + '&';
			else
			    cgiUrl = '/photo/p/api/video.php?ac=' + this.get('code') + '&';
            return cgiUrl + 'a=download&f=' + this.get('mediaId');
        },

        /**
         * Return the media's display url.
         * @param {string} size (default, 1, 2), omit this variable for default size , *video does not have size option
         * @return {string} Return the download url. 
         */         
        getThumbUrl: function(size){
            var cgiUrl = '/photo/p/api/thumb.php?m=display&ac=' + this.get('code') + '&';
			var size = size || 0;
            if(this.get('MediaType') === 'photo'){
                return cgiUrl + 'f=' + this.get('mediaId') + '&s=' + size;
            }
            else{
                return cgiUrl + 'f=' + this.get('mediaId') + '&t=video';
            }       
            
        },

        getDisplayUrl: function(){
            var cgiUrl = '/photo/p/api/';
            var size = size || 0;
            if(this.get('MediaType') === 'photo'){
                return cgiUrl + 'photo.php?m=display&ac=' + this.get('code') + '&f=' + this.get('mediaId') + '&s=' + size;
            }
            else{
                return cgiUrl + 'video.php?m=display&ac=' + this.get('code') + '&f=' + this.get('mediaId') + '&t=video';
            }  
        },

        /**
         * Get the width of this media
         * @return {string} Return the width of this media. 
         */     
        getWidth: function(){ return this.get('iWidth'); },
        
        /**
         * Get the height of this media
         * @return {string} Return the height of this media. 
         */ 
        getHeight: function(){ return this.get('iHeight'); },
        
        /**
         * Get the title of this media
         * @return {string} Return the title of this media. 
         */ 
        getTitle: function(){ return this.get('cPictureTitle'); },
        
        
        /**
         * Get the comment of this media
         * @return {string} Return the comment of this media. 
         */ 
        getComment: function(){ return this.get('comment'); },
 
        /**
         * Get the rating of this media
         * @return {string} Return the rating of this media. 
         */ 
        getRating: function(){ return this.get('rating'); },
          
        /**
         * Get the keywords of this media
         * @return {string} Return the keywords of this media. 
         */ 
        getKeyword: function(){ return this.get('keywords'); },
        
        
        /**
         * Get the height of this media
         * @return {object} Return object consists of lon(longitude) and lat(latitude). 
         */ 
        getGPS: function(){
            return {
                lon: this.get('longitude'),
                lat: this.get('latitude')
            }
        },
        

        /**
         * Get shrinked media width(fit version).
         * @param {Number} maxWidth The target media width.
         * @param {Number} maxHeight The target media height.
         */         
        getFitWidth: function(maxWidth, maxHeight){
            var mediaWidth = this.get('iWidth');
            var mediaHeight = this.get('iHeight');
            var width, height;
            if(mediaWidth/mediaHeight>=maxWidth/maxHeight){
                if(mediaWidth>maxWidth){ 
                    width=maxWidth;
                    //height=(mediaHeight*maxWidth)/mediaWidth;
                }else{
                    width=mediaWidth; 
                    //height=mediaHeight;
                }
            }
            else{
                if(mediaHeight>maxHeight){ 
                    //height=maxHeight;
                    width=(mediaWidth*maxHeight)/mediaHeight;     
                }else{
                    width=mediaWidth; 
                    //height=mediaHeight;
                }
            }
            return width;
        },
        
        /**
         * Get shrinked media height(fit version).
         * @param {Number} maxWidth The target media width.
         * @param {Number} maxHeight The target media height.
         */ 
        getFitHeight: function(maxWidth, maxHeight){
            var mediaWidth = this.get('iWidth');
            var mediaHeight = this.get('iHeight');
            var width, height;
            if(mediaWidth/mediaHeight>=maxWidth/maxHeight){
                if(mediaWidth>maxWidth){ 
                    //width=maxWidth;
                    height=(mediaHeight*maxWidth)/mediaWidth;
                }else{
                    //width=mediaWidth; 
                    height=mediaHeight;
                }
            }
            else{
                if(mediaHeight>maxHeight){ 
                    height=maxHeight;
                    //width=(mediaWidth*maxHeight)/mediaHeight;     
                }else{
                    //width=mediaWidth; 
                    height=mediaHeight;
                }
            }
            return height;          
        },
        
        /**
         * Get shrinked media width(fill version).
         * @param {Number} maxWidth The target media width.
         * @param {Number} maxHeight The target media height.
         */ 
        getFillWidth: function(maxWidth, maxHeight){
            var mediaWidth = this.get('iWidth');
            var mediaHeight = this.get('iHeight');
            var width, height;
            if(mediaWidth/mediaHeight>=maxWidth/maxHeight){
                if(mediaHeight>maxHeight){ 
                    //height=maxHeight;
                    width=(mediaWidth*maxHeight)/mediaHeight;     
                }else{
                    width=mediaWidth; 
                    //height=mediaHeight;
                }               
            }
            else{
                if(mediaWidth>maxWidth){ 
                    width=maxWidth;
                    //height=(mediaHeight*maxWidth)/mediaWidth;
                }else{
                    width=mediaWidth; 
                    //height=mediaHeight;
                }
            }
            return width;       
        },
        
        /**
         * Get shrinked media height(fill version).
         * @param {Number} maxWidth The target media width.
         * @param {Number} maxHeight The target media height.
         */ 
        getFillHeight: function(maxWidth, maxHeight){
            var mediaWidth = this.get('iWidth');
            var mediaHeight = this.get('iHeight');
            var width, height;
            if(mediaWidth/mediaHeight>=maxWidth/maxHeight){
                if(mediaHeight>maxHeight){ 
                    height=maxHeight;
                    //width=(mediaWidth*maxHeight)/mediaHeight;     
                }else{
                    //width=mediaWidth; 
                    height=mediaHeight;
                }               
            }
            else{
                if(mediaWidth>maxWidth){ 
                    //width=maxWidth;
                    height=(mediaHeight*maxWidth)/mediaWidth;
                }else{
                    //width=mediaWidth; 
                    height=mediaHeight;
                }
            }
            return height;          
        }       
        
    }); 
    
	var Album = Backbone.Collection.extend({
	    model: Media,
		initialize: function(){},
		fetchAll : function(options){
            //getAllPhoto Info.
            var self = this;
            var page = 1;

            var callback = {
                success: function(xmlString, textStatus, jqXHR){
                    var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
                    $xml.find('FileItem').each(function(key, value){
                        var mediaModel = new Media();
                        mediaModel.setInfo($(value));
                        self.push(mediaModel, {unSync: 1});
                    });
                    
                    //get next page
                    var mediaCount = self.estimateMediaCount($xml);
                    var totalPage  = parseInt(mediaCount / 100);
                    totalPage = (totalPage*100 < mediaCount) ? (totalPage+1) : totalPage;
                    
                    //has fetched page count
                    var successPage = 1;                
                    
                    //if there are rest pages (totalPage > 1) then keep fetching rest medias
                    //and call success callback function after finished fetching.
                    //if no rest pages then just call the success callback function.
                    if(totalPage > 1){
                        for(var i=1; i<totalPage; ++i){
                            getRestMedia(self.albumId, (i+1), {
                                success: function(){
                                    successPage++;
                                    if(successPage == totalPage)
                                        options && options.success && options.success(self);
                                },
                                error: function(errorThrown){
                                    options && options.error && options.error(errorThrown);
                                    return false;
                                }
                            });
                        }                       
                    }
                    else{
                        //completed
                        options && options.success && options.success(self);                    
                    } 
                },
                error: function(jqXHR, textStatus, errorThrown){
                    options && options.error && options.error(errorThrown);
                }
            };
            
            var getRestMedia = function(id, page, options){
                if(_.isUndefined(self.albumId)){
                    self.api.List.getAllMedia({p: page}, {
                        success: function(xmlString, textStatus, jqXHR){
                            var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
                            //$('#showMsg').text(xmlString).html();
                            $xml.find('FileItem').each(function(key, value){
                                var mediaModel = new Media();
                                mediaModel.setInfo($(value));
                                self.push(mediaModel, {unSync: 1});
                            });
                            options && options.success && options.success();                  
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            options && options.error && options.error(errorThrown);
                        }
                    });             
                }
                else{
                    PSPublicAPI.List.getAlbumItems(id, {p: page}, {
                        success: function(xmlString, textStatus, jqXHR){
                            var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
                            //$('#showMsg').text(xmlString).html();
                            $xml.find('FileItem').each(function(key, value){
                                var mediaModel = new Media();
                                mediaModel.setInfo($(value));
                                self.push(mediaModel, {unSync: 1});
                            });
                            options && options.success && options.success();                  
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            options && options.error && options.error(errorThrown);
                        }
                    });             
                }
            };
            if(_.isUndefined(this.albumId))
                return false;
            else            
                PSPublicAPI.List.getAlbumItems(this.albumId, {p: 1}, callback);		
		},
		
        /**
         * Fetch partial media models of this album from back-end. 
         * @param {object} options Pass 'p', 'c', 'h', 's', 'reset', 'type' references and optional callback function named success and error through this. Set 'reset' to 1 to clean this collection before fetching. Set 'type' to 'photo' to fetch only photos, set 'type' to 'video' to fetch only videos. Fetching both videos and photos
		 by not setting 'type'
         */
		fetch: function(options){
		//TODO there is a load video issue
		    var self = this;
			if(options.reset)
			    this.reset();
		    
			var callback = {
			    success: function(xmlString, textStatus, jqXHR){
					var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
					$xml.find('FileItem').each(function(key, value){
						var mediaModel = new Media();
						mediaModel.setInfo($(value));
						self.push(mediaModel, {unSync: 1});
					});
					//console.log(self.length);
					options && options.success && options.success(self);					
				},
				error: function(jqXHR, textStatus, errorThrown){
				    options && options.error && options.error(errorThrown);
				}
			};
			
			if(_.isUndefined(this.albumId))
			    return false;
			else
			    PSPublicAPI.List.getAlbumItems(this.albumId, options, callback);			
			
		},

		
		/**
         * Count photo and media amount, then plus them togather.
         * @private
         * @param {object} $xml object handled by handleXmlString().
         * @return return the total amount of media
         */
        estimateMediaCount: function($xml){
            var mediaCount = 0;
            if($xml.find('photoCount'))
                mediaCount += parseInt($xml.find('photoCount').text());
            if($xml.find('videoCount'))
                mediaCount += parseInt($xml.find('videoCount').text());
            return mediaCount;              
        },
		
        /**
         * get this album's id
         * @return {string} this album's id
         */
        getAlbumId: function(){
            return this.albumId;
        },
		
        /**
         * Fetch this album's information. (include: title, expiration, cover id, public status, cover url)
         * @param {object} [options] Includes callback functions named success and error.
         */ 
        fetchInfo: function(options){
		    if(_.isUndefined(this.albumId)){
			    options && options.error && options.error(this);
				return false;
			}
				
		    var self = this;
		    PSPublicAPI.List.getAllAlbums({
			    success: function(xmlString){
				    var $xml = PSPublicAPI.Util.handleXmlString(xmlString);
					if($xml.find('QDocRoot').children('status').text() == '0'){
					    $xml.find('FileItem').each(function(key, value){
						    if($(value).children('iPhotoAlbumId').text() == self.albumId){
								var list = [];
								var values = [];
								$(value).contents().each(function(key, value){
									list.push(this.nodeName);
									values.push($(value).text());
								});
								list.push('PhotoCount');
								values.push($(value).find('PhotoCount').text());
								list.push('VideoCount');
								values.push($(value).find('VideoCount').text());
								self.attrs = _.object(list, values);
								options && options.success && options.success(self);
							}
						});

					}
					else
					    options && options.error && options.error(self);
				},
				error: function(){
				    options && options.error && options.error(self);
				}
			});
        },
		
        /**
         * Get this album's cover url.
         * @return {string} this album's cover url
         */ 
        getCoverUrl: function(size){
		    var cgiUrl = '/photo/p/api/thumb.php';
		    if(size)
			    return cgiUrl + '?f=' + this.attrs.iAlbumCover + '&s=' + size + '&ac=' + this.attrs.coverCode;
			else
			    return cgiUrl + '?f=' + this.attrs.iAlbumCover + '&ac=' + this.attrs.coverCode;
        },
		
        /**
         * Get this album's data in a json stringify format.
         * @return {string} return json string
         */ 
        serialize: function(){
		    var attrs = this.attrs;
			attrs.coverUrl = this.getCoverUrl(2);
		    return JSON.stringify(attrs);
        },
		
        /**
         * Get this album's name.
         * @return {string} this album's name
         */ 
        getName: function(){
            return this.attrs.cAlbumTitle;
        },
        
        /**
         * Get this album's expiration status.
         * @return {string} this album's expiration status
         */ 
        getExpiration: function(){
            return this.attrs.expiration;
        },
        
        /**
         * Get this album's cover id.
         * @return {string} this album's cover id
         */ 
        getCover: function(){
            return this.attrs.iAlbumCover;
        },
        
        /**
         * Get this album's public status.
         * @return {string} this album's public status
         */ 
        getPublicStatus: function(){
            return this.attrs['public'];
        },
		
        /**
         * Get this album's media count(video count + photo count).
         * @return {Number} return count
         */ 
        getMediaCount: function(){
            return parseInt(this.attrs.VideoCount) + parseInt(this.attrs.PhotoCount);
        },
        
        /**
         * Get this album's video count.
         * @return {Number} return count
         */ 
        getVideoCount: function(){
            return parseInt(this.attrs.VideoCount);
        },
        /**
         * Get this album's photo count.
         * @return {Number} return count
         */ 
        getPhotoCount: function(){
            return parseInt(this.attrs.PhotoCount);
        },

        getTimeline: function(options){
		    PSPublicAPI.List.getTimeline(this.albumId, options, {
			    success: function(xmlString){
				    var data = $.xml2json(xmlString);
				    options && options.success && options.success(data);
				},
				error: function(){
				    options && options.error && options.error();
				}
			});
		},
		
		getVideoTimeline: function(options){
		    PSPublicAPI.List.getVideoTimeline(this.albumId, options, {
			    success: function(xmlString){
				    var data = $.xml2json(xmlString);
				    options && options.success && options.success(data);
				},
				error: function(){
				    options && options.error && options.error();
				}
			});		
		},
		
		getPhotoTimeline: function(options){
		    PSPublicAPI.List.getPhotoTimeline(this.albumId, options, {
			    success: function(xmlString){
				    var data = $.xml2json(xmlString);
				    options && options.success && options.success(data);
				},
				error: function(){
				    options && options.error && options.error();
				}
			});		
		},
		/**
         * Get this album's photo models by passing condition.
         * @param {object} options Search conditions
         * @return {array} array of matched photo models
         * @example
         * album.getPhotos({cAlbumTitle: 'hi~I am a album'});
         */ 
        getPhotos: function(options){
            var jData = options || {};
            jData.MediaType = 'photo';
            return this.where(jData);
        },
        
        /**
         * Get this album's video models by passing condition.
         * @param {object} options Search conditions
         * @return {array} array of matched video models
         */ 
        getVideos: function(options){
            var jData = options || {};
            jData.MediaType = 'video';
            return this.where(jData);
        },
        
        /**
         * Get this album's media models by passing condition.
         * @param {object} options Search conditions
         * @return {array} array of matched media models
         */ 
        getMedias: function(options){
            var jData = options || {};
            return this.where(jData);
        },
	});

}).call(this);