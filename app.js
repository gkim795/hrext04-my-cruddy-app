  var inviteList = {
    toInvite: [],
    removedList: [],
    addGuest: function(guestName){
      this.toInvite.push({
        guestName: guestName,
        completed: false
      });
    },
    changeGuest: function(position,newGuest){
      this.toInvite[position].guestName = newGuest;
    },
    removeGuest: function(position){
      var deleted = this.toInvite[position]
      this.removedList.push(deleted)
      this.toInvite.splice(position,1);
    },
    inviteSent: function(position){
      var invite = this.toInvite[position];
      invite.completed = !invite.completed;
    },
    clickAll: function (){
      var sentInvites = 0
      var totalInvites = this.toInvite.length;
  
      this.toInvite.forEach(function(invites){
        if(invites.completed===true){
          sentInvites++;
        }
      })
  
      this.toInvite.forEach(function(invites){
        if(sentInvites===totalInvites){
          invites.completed = false;
        } else {
          invites.completed = true;
        }
      });
    },
  };
  
  var input = document.getElementById("add-text");

  input.addEventListener("keyup",function(event){
    if(event.keyCode === 13){
      document.getElementById("add").click();
    }
  },{passive:true});
  
  
  
  var m = {
    clickAll: function(){
      inviteList.clickAll();
      view.displayGuestList();
    },
    addGuest: function(){
      var input = document.getElementById("add-text");
      inviteList.addGuest(input.value)
      input.value = '';
      view.displayGuestList();
    },
    change: function(position){
      var changeTo = document.getElementById('change-text')
      inviteList.changeGuest(position, changeTo.value);
      changeTo.value = '';
      view.displayGuestList();
    },
  
    delete: function(position){
      inviteList.removeGuest(position)
      view.displayGuestList();
    },
    sent: function(position){
      inviteList.inviteSent(position);
      view.displayGuestList();
    },
  };
  
  var view = {
    displayGuestList: function() {
      var guestListUl = document.querySelector('ul')
      guestListUl.innerHTML = '';
  
      inviteList.toInvite.forEach(function(inviteList,position){
        var guestli = document.createElement('li')
        var guestStatus = '';
  
        if(inviteList.completed===true){
          guestStatus = '(x) '+inviteList.guestName;
        } else {
          guestStatus = '( ) '+inviteList.guestName;
        }
        
        guestli.id = position;
        guestli.textContent = guestStatus;
        guestli.appendChild(this.createDeleteButton());
        guestli.appendChild(this.createSentButton());
        guestli.appendChild(this.createEditButton());
        guestListUl.appendChild(guestli);
  
      },this);
    },
    
    createDeleteButton: function() {
      var deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'deleteButton'
      
      return deleteButton;
    },
    createSentButton: function(){
      var sentButton = document.createElement('button');
      sentButton.textContent = 'Invite Sent'
      sentButton.className = 'sentButton'
  
      return sentButton;
    },
    createEditButton: function(){
      var editButton = document.createElement('button');
      editButton.textContent = 'Change to above'
      editButton.className = 'editButton'
  
      return editButton;
    },
    
    setUpEventListeners: function (){
      var guestListUl = document.querySelector('ul')
      
      guestListUl.addEventListener('click',function(event){
      var elementClicked = event.target;
      var position = parseInt(elementClicked.parentNode.id)
  
      if(elementClicked.className === 'deleteButton'){
        m.delete(position);
      } else if (elementClicked.className === 'sentButton'){
        m.sent(position)
      } else if (elementClicked.className === 'editButton'){
        m.change(position)
      };
        
      },{passive:true});
    }
  }
  
  view.setUpEventListeners();
  

  var chart = null;
  function chartUpdate (){
    console.log(inviteList.toInvite)
    var sent =  0
    var notsent = 0

    inviteList.toInvite.forEach(function(invite){
      if(invite.completed === true){
        sent ++
      } else {
        notsent ++
      }

    });

    chart = c3.generate({
      data: {
          columns: [
              ['invites sent', sent],
              ['invites not sent', notsent],
          ],
          type : 'donut',
      },
      donut: {
          title: "Guest List Status"
      }
  });

  }


  function constantUpdate (updatedata){
    chart.load({
      columns:updatedata
    })
  }
  
 