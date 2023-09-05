<template>
	<view class="emoji">
		<view class="delete" @tap="deleteEmoji"><image src="../../static/images/chatroom/delete.png"></image></view>
		<view class="emoji-row" v-for="(row, i) in emoji" :key="i">
			<view class="emoji-col" v-for="(col, j) in row" :key="j" @tap="clickEmoji(col)">{{ col }}</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'emoji',
	data() {
		return {
			emoji: [
				['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆'],
				['😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙'],
				['😚', '🙂', '🙂', '🤗', '🤔', '😐', '😑', '😶'],
				['🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪'],
				['😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒'],
				['😓', '😔', '😕', '🙃', '🤑', '😲', '🤤', '🙁'],
				['😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧'],
				['😨', '😩', '😬', '😰', '😱', '😳', '😵', '😡'],
				['😠', '😷', '🤒', '🤕', '🤢', '🤧', '😇', '🤠'],
				['🤡', '🤥', '🤓', '😈', '👿', '👹', '👺', '💀'],
				['👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻'],
				['😼', '😽', '🙀', '😿', '😾', '🏻', '🏼', '🏽'],
				['🏾', '🏿', '🗣', '👤', '👥', '👫', '👬', '👭'],
				['👂', '👂🏻', '👂🏼', '👂🏽', '👂🏾', '👂🏿', '👃', '👃🏻'],
				['👃🏼', '👃🏽', '👃🏾', '👃🏿', '👣', '👀', '👁', '👅'],
				['👄', '👓', '🕶', '👔', '👕', '👖', '👗', '👘'],
				['👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟'],
				['👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '⛑'],
				['💄', '💍', '🌂', '💼', '🏁', '🚩', '🎌', '🏴'],
				['1','1','1','1',]
			]
		};
	},
	methods: {
		//点击表情
		clickEmoji(emoji) {
			this.$emit('sendEmoji', emoji);
		},
		//删除表情
		deleteEmoji() {
			this.$emit('deleteEmoji');
		}
	}
};
</script>

<style lang="scss" scoped>
.emoji {
	width: 100%;
	height: 460rpx;
	overflow: scroll;
	padding: 10rpx;
	.delete {
		width: 120rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		right: 30rpx;
		bottom: 30rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
		position: fixed;
		opacity: 0.9;
		image {
			width: 96rpx;
			height: 80rpx;
		}
	}
	.emoji-row {
		padding-right: 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		.emoji-col {
			font-size: 60rpx;
		}
	}
	.emoji-row:last-child {
		padding-top: 20rpx;
		visibility: hidden;
	}
}
</style>
