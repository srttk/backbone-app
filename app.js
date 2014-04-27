$(function(){

	// Contact model
	var Contact=Backbone.Model.extend({
		validate: function(attrs, options) {
	    if (attrs.name=="") {
	      return "Name required";
	    }
	    if (attrs.email=="") {
	      return "Email field required";
	    }
	    //Validationg email filedwith RegExp
	    regex_email=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	    if(!regex_email.test(attrs.email))
	    {
	    	return "Enter a valid email address";
	    }
	  },
		defaults:{
			name:'Someone',
			email:'someone@gmail.com'
		},
		initialize:function(){
			this.on('invalid',function(model,error){alert(error);})
		}
	});

	// ContactList (Collection)
	var ContactList=Backbone.Collection.extend({
		model:Contact
	});

	// NewContact View
	var NewContactView=Backbone.View.extend({
		el:$("#newcontact"),
		initialize:function(){
			this.render();
		},
		events:{
			'click .btn':'createNew'
		},
		render:function(){
			//this.$el.html("Hello World");
		}
		,
		createNew:function(){
			this.trigger('EventNew',{'name':$('#name').val(),'email':$('#email').val()});
		}
	});
	// Contact View (For single contact model)
	var ContactView=Backbone.View.extend({
		tagName:"div",
		className:'list-group-item',
		template:_.template('<h3 class="list-group-heading"><span class="glyphicon glyphicon-user" style="color:#95A5A6;"></span> <%= name %> <a href="#" class="pull-right remove"><span class="glyphicon glyphicon-remove" ></span></a></h3><p><span class="glyphicon glyphicon-envelope" style="color:#F1C40F;"></span> <a href="mailto:<%= email %>"><%= email %></a></p>'),
		initialize:function(){
			this.render();
		},
		events:{
			'click .remove':'removeme'
		},
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		removeme:function(){
			this.model.destroy();
			this.$el.slideUp(function(){this.remove();});
			//this.$el.remove();
			console.log(contacts);
		}
	});
	// Contact List View (For Contactlist Collection)
	var ListView=Backbone.View.extend({
		el:$('.list-group'),
		initialize:function(){
			this.render();
			this.collection.on('add',this.render,this);
		},
		render:function(){
			this.$el.html('');
			this.collection.each(this.addOne,this);
		},
		addOne:function(contact){
			var cv=new ContactView({model:contact});
			this.$el.append(cv.render().el);

		}
	});

	//Creating  contact collection instance in memmory
	var contacts=new ContactList();
	
	// Invoking Fetch : Fetching JSON data from server
	contacts.url='data.json';
	contacts.fetch({
		beforeSend:function(){
			$(".list-group").html('<img src="img/loading.gif" alt="Loding.." />');
		},
		success:function(data)
		{
			console.log(data);
		},
		error:function(xhr){
			$(".list-group").html('<p class="alert alert-danger alert-dismissable" >Connection Error<a class="close" data-dismiss="alert">&times;</p>');
		}
	});
	// 

	// App router

	var AppRouter=Backbone.Router.extend({
		//Routes
		routes:{
			'':'home'
		},
		//Home Handler
		home:function(){
			$("#newcontactform").show();
			var appview=new ListView({collection:contacts});

			var newcontact=new NewContactView();
			newcontact.on('EventNew',function(attr){
			//contacts.add(attr); //Direct adding to collection
				mcon=new Contact(attr);
				if(mcon.isValid()){
					contacts.add(mcon);
				}else{
					return false;
				}
				$('#name').val('');$('#email').val('');
				Backbone.history.navigate('',true);
			});
		}
	});

	var approuter=new AppRouter();
	Backbone.history.start();


});