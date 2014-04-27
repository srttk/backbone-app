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
			'click .btn':'createNew',
			'keydown .btn':'createNew'
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
		template:_.template('<h3 class="list-group-heading"><span class="glyphicon glyphicon-user"></span> <%= name %> <a href="#" class="pull-right remove"><span class="glyphicon glyphicon-remove"></span></a></h3><p><%= email %></p>'),
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
			this.$el.remove();
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
			console.log('Lst');
			var cv=new ContactView({model:contact});
			this.$el.append(cv.render().el);

		}
	});
	var contacts=new ContactList([{name:'sarath',email:'sarath@hacksone.com'},{name:'Hacker',email:'sarath@hacksone.com'}]);
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
			console.log(contacts);
			$('#name').val('');$('#email').val('');
			Backbone.history.navigate('',true);
		});

	




});