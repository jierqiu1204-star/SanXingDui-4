const openai = {
  baseURL: 'https://api.deepseek.com',
  apiKey: 'YOUR_DEEPSEEK_API_KEY'
};

Page({
  data: {
    messages: [],
    inputValue: '',
    showEmojiPanel: false
  },

  onLoad() {
    // 可以在这里初始化其他数据
  },

  // 处理输入
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  async sendMessage(e) {
    const content = e.detail.value || this.data.inputValue;
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      avatar: '/assets/images/user-avatar.png',
      name: '我',
      content: content,
      time: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: ''
    });

    // 添加等待消息
    const waitingMessage = {
      id: Date.now() + 1,
      type: 'service',
      avatar: '/images/dialog/SanXingDui.png',
      name: 'DeepSeek',
      content: '思考中...',
      time: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };

    this.setData({
      messages: [...this.data.messages, waitingMessage]
    });

    try {
      // 调用 DeepSeek API
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: `${openai.baseURL}/chat/completions`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openai.apiKey}`
          },
          data: {
            model: "deepseek-chat",
            messages: [
              {"role": "system", "content": "You are a helpful assistant."},
              {"role": "user", "content": content}
            ],
            stream: false
          },
          success: (res) => {
            console.log('API 成功响应:', res);
            if (res.statusCode === 200) {
              resolve(res);
            } else {
              reject(new Error(`API 状态码错误: ${res.statusCode}`));
            }
          },
          fail: (err) => {
            console.error('API 请求失败:', err);
            reject(err);
          }
        });
      });

      console.log('完整 API 响应:', response);

      if (!response.data) {
        throw new Error('响应数据为空');
      }

      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('响应数据格式错误');
      }

      const aiResponse = response.data.choices[0].message.content;

      // 更新 AI 回复
      const aiMessage = {
        id: Date.now() + 2,
        type: 'service',
        avatar: '/images/dialog/SanXingDui.png',
        name: 'DeepSeek',
        content: aiResponse,
        time: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };

      // 移除等待消息并添加 AI 回复
      const newMessages = this.data.messages.filter(msg => msg.id !== waitingMessage.id);
      this.setData({
        messages: [...newMessages, aiMessage]
      });

    } catch (error) {
      console.error('DeepSeek API 调用失败:', error);
      
      // 更新错误消息
      const errorMessage = {
        id: Date.now() + 2,
        type: 'service',
        avatar: '/images/dialog/SanXingDui.png',
        name: 'DeepSeek',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        time: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };

      // 移除等待消息并添加错误消息
      const newMessages = this.data.messages.filter(msg => msg.id !== waitingMessage.id);
      this.setData({
        messages: [...newMessages, errorMessage]
      });
    }

    // 自动滚动到最新消息
    this.scrollToBottom();
  },

  // 滚动到最新消息
  scrollToBottom() {
    wx.createSelectorQuery()
      .select('.message-list')
      .boundingClientRect(function(rect){
        wx.pageScrollTo({
          scrollTop: rect.height,
          duration: 300
        });
      })
      .exec();
  },

  // 切换表情面板
  toggleEmojiPanel() {
    this.setData({
      showEmojiPanel: !this.data.showEmojiPanel
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const newMessage = {
          id: Date.now(),
          type: 'user',
          avatar: '/assets/images/user-avatar.png',
          name: '我',
          content: res.tempFilePaths[0],
          isImage: true,
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit'
          })
        };
        
        this.setData({
          messages: [...this.data.messages, newMessage]
        });

        // 自动滚动到最新消息
        this.scrollToBottom();
      }
    });
  }
}); 
