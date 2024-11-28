package com.sports.user.refresh;

import com.sports.user.entito.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class UserRefreshToken {
    @Id
    private Long id;
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    private String refreshToken;

    public UserRefreshToken(User user, String refreshToken) {
        this.user = user;
        this.refreshToken = refreshToken;
    }

    // 리프레시 토큰을 새로운 값으로 갱신
    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // 리프레시 토큰의 유효성을 검증
    public boolean validateRefreshToken(String refreshToken) {
        return this.refreshToken.equals(refreshToken);
    }

}
