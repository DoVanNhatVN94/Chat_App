using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mychat.src.Hooks
{
    public class a
    {
         private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;



        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "MyChat Bot";
            _connections = connections;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
                SendUsersConnected(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }


        public async Task JoinRoom(UserConnection userConnection)
        {
            //Hàm này sẽ thêm người dùng vào phòng chat
            await Groups.AddToGroupAsync(Context.ConnectionId,userConnection.Room);

            //sau đó gửi một tin nhắn thông báo tới tất cả các người dùng khác trong phòng chat bằng cách sử dụng phương thức Clients.Groups.SendAsync
            await Clients.Groups(userConnection.Room).SendAsync("ReceiveMessage",_botUser,$"{userConnection.User} has joined {userConnection.Room}");
		}

        public async Task SendMessage(string message)
        {

            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
            }


        }

        public Task SendUsersConnected(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User);

            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }


    }
}