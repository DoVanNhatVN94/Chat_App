using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using Service;
using System.Linq;
using System;


namespace Service.Hubs
{
	public class ChatHub: Hub
	{
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;

        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "MyChat Bot";
            _connections = connections;
        }

        // khi người dùng đóng conection của họ hoặc họ tắt app, chức năng này đc khởi động và thông báo đến tất cả người dùng trong group
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

        // đây là hàm bắt sk join của người dùng 
        
        public async Task JoinRoom(UserConnection userConnection)
        {
            // Tạo môt group và add người dùng vào bằng connectionId và room (do người dùng truyền lên)
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections[Context.ConnectionId] = userConnection;
            // phẩn hồi cho các người dùng có trong group (room : do người dùng truyền lên )
            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined {userConnection.Room}");

            await SendUsersConnected(userConnection.Room);
        }

        public async Task SendMessage(string message)
        {
            // kiểm tra id conect của người dùng có tồn tại trong group đok không !
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }

        // phuong thức này để duyệt ds người dùng và gữi phản hồi cho tất cả họ
        // Cho phép chúng ta biết ai còn lại trong room
        public Task SendUsersConnected(string room)
        {

            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User);

            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }


    }
}

